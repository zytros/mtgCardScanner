"""Helper script to download the ImageNet1k dataset from huggingface. Create an API access token and store it in the token field."""

from datasets import load_dataset
from collections import OrderedDict
from datasets.tasks import ImageClassification

import os
import datasets

#TODO: input your API access token from huggingface here
hf_token = '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'

# prepare folders to store the dataset in
this_folder_path = os.path.dirname(os.path.abspath(__file__)) # should be the imagenet1k folder
data_path = os.path.join(this_folder_path, "data")
os.makedirs(data_path, exist_ok=True)

# download the dataset
# dataset = load_dataset('imagenet-1k', split='train', streaming=False, token=hf_token, trust_remote_code=True, cache_dir=data_path)
dataset = load_dataset('imagenet-1k', split='train', streaming=False, token=hf_token, trust_remote_code=True)



# Code adapted from:
# Copyright 2022 the HuggingFace Datasets Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
CLASSES = OrderedDict(
    {
        "n01614925": "bald eagle, American eagle, Haliaeetus leucocephalus",
        "n01616318": "vulture",
        "n02128385": "leopard, Panthera pardus",
        "n02130308": "cheetah, chetah, Acinonyx jubatus",
        "n02280649": "cabbage butterfly",
        "n02317335": "starfish, sea star",
        "n02119022": "red fox, Vulpes vulpes",
        "n02123394": "Persian cat",
        "n02206856": "bee",
        "n02391049": "zebra",
    }
)