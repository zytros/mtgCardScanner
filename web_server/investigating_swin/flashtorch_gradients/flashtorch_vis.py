from transformers import ViTForImageClassification
import torch
from flashtorch.utils import apply_transforms, load_image
from flashtorch.saliency import Backprop
import numpy as np
import os
from cls2idx import CLS2IDX
import time
import matplotlib.pyplot as plt
os.environ['KMP_DUPLICATE_LIB_OK']='True'

vit = ViTForImageClassification.from_pretrained("google/vit-base-patch16-224")

def list_files(directory):
    return [directory+'/'+f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]


def show_and_save_image(tens1, tens2, alpha, fn, show=False, cmap='plasma'):
    fig = plt.figure(figsize=(10,10))
    ax = fig.gca()
    ax.set_aspect('equal')
    ax.imshow(tens1,extent=[0,1,0,1])
    ax.imshow(tens2, cmap=cmap, alpha=alpha, extent=[0,1,0,1])
    plt.axis('off')
    plt.savefig(fn, bbox_inches='tight', pad_inches=0)
    if show:
        plt.show()
    

    
def redistr_and_clip(tensor):
    tensor = 5*tensor
    tensor = tensor-2
    tensor = torch.clamp(tensor, 0, 1)
    return tensor

def getVisualization(image_path, verbose=False):
    backprop = Backprop(vit)
    image = load_image(image_path)
    input_image = apply_transforms(image)
    vit.eval()
    output = vit(input_image).logits
    output = torch.nn.functional.softmax(output, dim=1)
    output = output.detach().numpy().flatten()

    target_class = np.argmax(output)
    if verbose:
        #print(target_class)
        print(CLS2IDX.get(target_class))
        #print(f'with probability {output[target_class]}%')
    _,_,subplots = backprop.visualize(input_image, target_class, guided=True, return_output=True, alpha=0.6, cmap='bwr') #alpha 0 = image, 1 = saliency

    new_tens = redistr_and_clip(subplots[3][1][1][0])
    subplots_list = list(subplots)
    subplots_list[3][1][1] = list(subplots_list[3][1][1])
    subplots_list[3][1][1][0] = new_tens
    
    fn_parts = image_path.split('.png')
    fn = fn_parts[0] + '_gradients.png'
    show_and_save_image(subplots[3][1][0][0], subplots[3][1][1][0], 0.5, fn=fn, show=False, cmap='bwr')
    
files = list_files('data/NEWIMAGESNOCOPYRIGHT/Persian Cat')
for fn in files:
    if fn.endswith('_gradients.png'):
        continue
    getVisualization(fn, verbose=True)
    