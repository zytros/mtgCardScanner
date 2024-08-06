# activation grids
import sklearn.decomposition
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
from lucent.modelzoo import *
from lucent.misc.io import show
import lucent.optvis.objectives as objectives
import lucent.optvis.param as param
import lucent.optvis.render as render
import lucent.optvis.transform as transform
from lucent.misc.channel_reducer import ChannelReducer
from lucent.misc.io import show
from itertools import product
import numpy as np
import torch
import torchvision
import sklearn

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

@torch.no_grad()
def get_layer(model, layer, X):
    layers = layer.split(".")
    curr_layer = model
    for layer in layers:
        curr_layer = eval("curr_layer." + layer) # hackerman to allow recursion even through module lists
    hook = render.ModuleHook(curr_layer)
    model(X)
    hook.close()
    return hook.features


@objectives.wrap_objective()
def dot_compare(layer, acts, patch_no, batch):
    acts = torch.from_numpy(acts).to(device)
    def inner(T):
        pred = T(layer)
        # print(pred.shape) # (196, 197, 768)
        pred = pred[patch_no, patch_no+1, batch*64:(batch+1)*64] # get the 64 neurons corresponding to that attention head and that patch
        # print(pred.shape) # (64)
        # print(acts.shape) # (64)
        return -(pred * acts).sum(dim=0, keepdims=True).mean()
    return inner

def naive_activation_grid_vit(
    img,
    model,
    layer,
    n_steps=1024
):
    layer = layer + ".attention.attention.output_context" # we want to focus on the attention heads. "output_context" are the concatenated attention scores of all attention heads.
    patch_image_size=16 # the size of each patch as pixel
    # Normalize and resize the image
    img = torch.tensor(np.transpose(img, [2, 0, 1])).to(device)
    normalize = (transform.normalize())
    transforms = transform.standard_transforms.copy() + [
        normalize,
        torch.nn.Upsample(size=224, mode="bilinear", align_corners=True),
    ]
    transforms_f = transform.compose(transforms)
    # shape: (1, 3, original height of img, original width of img)
    img = img.unsqueeze(0)
    # shape: (1, 3, 224, 224)
    img = transforms_f(img)


    attention_scores = get_layer(model, layer, img)[0]
    # print(attention_scores.shape) # (197, 768)
    attention_scores = attention_scores.reshape([197, 12, 64])
    
    attention_scores_np = attention_scores.cpu().numpy()
    # print(attention_scores_np.shape) # (197, 12, 64)
    num_patches, n_attention_heads, _ = attention_scores_np.shape
    num_patches -= 1 # remove the x_class
    
    # do naive implementation first
    
    # for each position `(y, x)` in the feature map `acts`, we optimize an image
    # to match with the features `acts[:, y, x]`
    # This means that the total number of cells (which is the batch size here) 
    # in the grid is layer_height*layer_width.
    nb_cells = (num_patches-1) # cell for each patch for one activation head
    
    # rename layer so that the render function finds it
    layer_converted = layer.replace(".", "_")
    layer_converted = layer_converted.replace("[", "_")
    layer_converted = layer_converted.replace("]", "")
    
    for attention_head in range(n_attention_heads):
        # Parametrization of the of each cell in the grid
        param_f = lambda: param.image(
            h=patch_image_size, w=patch_image_size, batch=num_patches
        )

        obj = objectives.Objective.sum(
            [
                # for each attention head and for each patch, maximize the dot product between the attention scores
                # at the position (x, attention_head), where x denotes the patch number (1 ... 176) and each attention head
                # has 64 attention scores per patch. As our attention_scores are already ordered by the number of heads,
                # we can simply take the attention_scores_np[x+1, attention_head] to get the attention scores for the x-th patch.
                # We ignore the first patch in the attentions_scores, as this is the x_class, which is not directly correlated
                # to one image patch.
                # With `dot_compare`, we maximize the dot product between
                # the attention scores during optimization and the actual attention scoress for the input image
                # for each attention head then take the average to get a single number. Check `dot_compare` for more details.
                
                dot_compare(layer_converted, attention_scores_np[x+1, attention_head], patch_no=x, batch=attention_head) # +1 to skip the first patch (x_class)
                for i, x in enumerate(range(num_patches)) # try for one attention head first
            ]
        )
        
        image_name = f"{layer}_attention_head_{attention_head}.png"
        results = render.render_vis(
            model,
            obj,
            param_f,
            thresholds=(n_steps,),
            progress=True,
            fixed_image_size=224,
            show_image=False,
            save_image=True,
            image_name=image_name
        )
        # shape: (layer_height*layer_width, cell_image_size, cell_image_size, 3)
        imgs = results[-1] # last step results
        # shape: (layer_height*layer_width, 3, cell_image_size, cell_image_size)
        imgs = imgs.transpose((0, 3, 1, 2))
        imgs = torch.from_numpy(imgs)
        imgs = imgs[:, :, 2:-2, 2:-2]
        # turn imgs into a a grid
        grid = torchvision.utils.make_grid(imgs, nrow=14,padding=0)
        grid = grid.permute(1, 2, 0)
        grid = grid.numpy()
        # save grid of images
        grid_image = Image.fromarray((grid * 255).astype('uint8'))
        grid_image.save(image_name)
    



def less_naive_activation_grid_vit(
    img, 
    model, 
    layer,
    n_groups=6, # number of groups to reduce the 64 neurons to
    n_steps=1024):
    
    layer = layer + ".attention.attention.output_context" # we want to focus on the attention heads. "output_context" are the concatenated attention scores of all attention heads.
    patch_image_size=16 # the size of each patch as pixel
    
    # First wee need, to normalize and resize the image
    img = torch.tensor(np.transpose(img, [2, 0, 1])).to(device)
    normalize = (
        transform.preprocess_inceptionv1()
        if model._get_name() == "InceptionV1"
        else transform.normalize()
    )
    transforms = transform.standard_transforms.copy() + [
        normalize,
        torch.nn.Upsample(size=224, mode="bilinear", align_corners=True),
    ]
    transforms_f = transform.compose(transforms)
    # shape: (1, 3, original height of img, original width of img)
    img = img.unsqueeze(0)
    # shape: (1, 3, 224, 224)
    img = transforms_f(img)

    attention_scores = get_layer(model, layer, img)[0]
    
    # print(attention_scores.shape) # (197, 768)
    attention_scores = attention_scores.reshape([197, 12, 64])
    
    attention_scores_np = attention_scores.cpu().numpy()
    # print(attention_scores_np.shape) # (197, 12, 64)
    num_patches, n_attention_heads, _ = attention_scores_np.shape
    num_patches -= 1 # remove the x_class
    
    # rename layer so that the render function finds it
    layer_converted = layer.replace(".", "_")
    layer_converted = layer_converted.replace("[", "_")
    layer_converted = layer_converted.replace("]", "")
    
    # PCA is used to reduce the number
    # of channels to n_groups. This will be used as the following.
    # Each cell image in the grid is decomposed into a sum of
    # (n_groups+1) images. First, each cell has its own set of parameters
    #  this is what is called `cells_params` (see below). At the same time, we have
    # a of group of images of size 'n_groups', which also have their own image parametrized
    # by `groups_params`. The resulting image for a given cell in the grid
    # is the sum of its own image (parametrized by `cells_params`)
    # plus a weighted sum of the images of the group. Each each image from the group
    # is weighted by `groups[cell_index, group_idx]`. Basically, this is a way of having
    # the possibility to make cells with similar activations have a similar image, because
    # cells with similar activations will have a similar weighting for the elements
    # of the group.
    
    # We have 64 neurons per patch per attention head. We want to reduce this to `n_groups` using sklearn's PCA.
    if n_groups > 0:
        reducer = sklearn.decomposition.PCA(n_components=n_groups)
        groups = np.zeros([num_patches+1, n_attention_heads, n_groups])
        for patch in range(num_patches+1):
            groups[patch] = reducer.fit_transform(attention_scores[patch])
        groups /= groups.max(0)
    else:
        groups = np.zeros([])
    
    for attention_head in range(1, n_attention_heads):
    
        # shape: (197, 12, n_groups)
        groups = torch.from_numpy(groups)

        # Parametrization of the images of the groups (we have 'n_groups' groups)
        groups_params, groups_image_f = param.fft_image(
            [n_groups, 3, patch_image_size, patch_image_size]
        )
        # Parametrization of the images of each cell in the grid (we have 'layer_height*layer_width' cells)
        cells_params, cells_image_f = param.fft_image(
            [num_patches, 3, patch_image_size, patch_image_size]
        )

        # First, we need to construct the images of the grid
        # from the parameterizations
        

        def image_f():
            groups_images = groups_image_f()
            cells_images = cells_image_f()
            X = []
            for i in range(num_patches):
                x = 0.7 * cells_images[i, attention_head] + 0.5 * sum(
                    groups[i, attention_head, j] * groups_images[j] for j in range(n_groups)
                )
                X.append(x)
            X = torch.stack(X)
            return X

        # make sure the images are between 0 and 1
        image_f = param.to_valid_rgb(image_f, decorrelate=True)

        # After constructing the cells images, we sample randomly a mini-batch of patches
        # from the grid. This is to prevent memory overflow, especially if the grid
        # is large.
        def sample(image_f, batch_size):
            def f():
                X = image_f()
                inds = torch.randint(0, len(X), size=(batch_size,))
                inputs = X[inds]
                # HACK to store indices of the mini-batch, because we need them
                # in objective func. Might be better ways to do that
                sample.inds = inds
                return inputs

            return f

        image_f_sampled = sample(image_f, batch_size=num_patches)

        # Now, we define the objective function
        def objective_func(model):
            pred = model(layer_converted)[sample.inds, sample.inds+1, attention_head*64:(attention_head+1)*64]
            # use the sampled indices from `sample` to get the corresponding targets instead of summing over all patches
            target = attention_scores[sample.inds+1, attention_head].to(pred.device)
            # shape: (batch_size, layer_channels, 1, 1)
            dot = (pred * target).sum().mean()
            return -dot

        obj = objectives.Objective(objective_func)

        def param_f():
            # We optimize the parametrizations of both the groups and the cells
            params = list(groups_params) + list(cells_params)
            return params, image_f_sampled

        image_name = f"{layer}_attention_head_{attention_head}.png"
        
        results = render.render_vis(
            model,
            obj,
            param_f,
            thresholds=(n_steps,),
            show_image=False,
            progress=True,
            fixed_image_size=224,
            save_image=True,
            image_name=image_name
        )
        # shape: (layer_height*layer_width, 3, grid_image_size, grid_image_size)
        imgs = image_f()
        imgs = imgs.cpu().data
        imgs = imgs[:, :, 2:-2, 2:-2]
        # turn imgs into a a grid
        grid = torchvision.utils.make_grid(imgs, nrow=14,padding=0)
        grid = grid.permute(1, 2, 0)
        grid = grid.numpy()
        # save grid of images
        grid_image = Image.fromarray((grid * 255).astype('uint8'))
        grid_image.save(image_name)


if __name__=="__main__":
    model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224').eval().to(device)
    img = np.array(Image.open("cat.png"), np.float32)
    layer = "vit.encoder"
    layer = "vit.encoder.layer[9]"
    _ = less_naive_activation_grid_vit(img, model, layer=layer, n_steps=512)

