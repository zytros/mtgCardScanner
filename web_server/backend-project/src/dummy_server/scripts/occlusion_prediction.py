import torch
from torch.nn.functional import interpolate
from PIL import Image
from torchvision.transforms import Compose, Resize, CenterCrop, ToTensor, Normalize
import time
from dummy_server.scripts.cls2idx import CLS2IDX
import timm
model = timm.create_model("timm/vit_base_patch16_224.orig_in21k_ft_in1k", pretrained=True)
model = model.eval()
data_config = timm.data.resolve_model_data_config(model)

def load_transform_image(image_pth, size=224):
    image_pth = image_pth.replace('...', '/')
    image_pth = 'data/images/'+image_pth
    image = Image.open(image_pth).convert("RGB")
    #means = [0.485, 0.456, 0.406]
    #stds = [0.229, 0.224, 0.225]
    means = [0.5,0.5,0.5]
    stds = [0.5,0.5,0.5]

    transform = Compose([
        Resize(size),
        CenterCrop(size),
        ToTensor(),
        Normalize(means, stds)
    ])

    tensor = transform(image).unsqueeze(0)
    return tensor

def create_mask_tensor(mask):
    #inp: mask of 28*28
    ##
    tens = torch.tensor(mask).float()
    tens = tens.unsqueeze(0).unsqueeze(0)
    tens = interpolate(tens, size=224, mode='nearest')
    tens = tens.squeeze(0).squeeze(0)
    tens = tens.transpose(0, 1)
    tens = torch.stack([tens, tens, tens])
    tens = tens.unsqueeze(0)
    return tens

def get_masked_prediction(image_fn, mask):
    start_time = time.time()
    image = load_transform_image(image_fn) 
    mask_tens = create_mask_tensor(mask)
    masked_image = image * mask_tens
    """
    From here on what modified to fit timm model usage 
    """
    ##Image.fromarray(masked_image.numpy()).unsqueeze(0)
    #model expects img to be just pillow image 
    #img = Image.fromarray(masked_image.numpy())
    #masked_image = masked_image.squeeze(0).permute(1, 2, 0)  # (224, 224, 3)
    #masked_image = masked_image.mul(255).byte().numpy()  # Scale to [0, 255] and convert to uint8
    #img = Image.fromarray(masked_image)
    #print(type(transforms(img)))
    output = model(masked_image)
    top_values, top_indices = torch.topk(output.softmax(dim=1), k=5)

    """
    output = model(masked_image).logits.softmax(dim=1)
    top_values, top_indices = output.topk(5)
    """
    
    end_time = time.time()
    print(f"Time taken for masked prediction: {end_time - start_time}")
    out = []
    for i in range(5):
        out.append({
            'name': CLS2IDX.get(top_indices[0][i].item()).split(',')[0], 
            'confidence': round(top_values[0][i].item()*100,1)
            })
    
    return out

