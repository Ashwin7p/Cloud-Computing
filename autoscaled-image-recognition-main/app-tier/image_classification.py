import torch
import torchvision
import torchvision.transforms as transforms
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from urllib.request import urlopen
from PIL import Image
import numpy as np
import json
import sys
import time



import sys
import json
import torch
import torchvision.models as models
from torchvision import transforms
from PIL import Image

class Classifier:
    def __init__(self):
        self.model = models.resnet18(pretrained=True)
        self.model.eval()

        with open('./imagenet-labels.json') as f:
            self.labels = json.load(f)
        print("Resnet model loaded")

    def get_classification(self, url):
        # print("Running processing for", url)
        img = Image.open(url)
        img_tensor = transforms.ToTensor()(img).unsqueeze_(0)
        outputs = self.model(img_tensor)
        _, predicted = torch.max(outputs.data, 1)
        result = self.labels[np.array(predicted)[0]]
        img_name = url.split("/")[-1]
        save_name = f"{img_name},{result}"
        return result

# Usage example:
if __name__ == "__main__":
    # Create an instance of the Classifier class
    classifier = Classifier()
    
    # Call the get_classification method with a URL
    url = "/home/ubuntu/image_proc_folder/test_0.JPEG"
    classification = classifier.get_classification(url)
    print(classification)



# def get_classification(url):
#     # url = str(sys.argv[1])
#     #img = Image.open(urlopen(url))
#     print("Running processing for ",url)
#     img = Image.open(url)

#     model = models.resnet18(pretrained=True)

#     model.eval()
#     img_tensor = transforms.ToTensor()(img).unsqueeze_(0)
#     outputs = model(img_tensor)
#     _, predicted = torch.max(outputs.data, 1)

#     with open('./imagenet-labels.json') as f:
#         labels = json.load(f)
#     result = labels[np.array(predicted)[0]]
#     img_name = url.split("/")[-1]
#     #save_name = f"({img_name}, {result})"
#     save_name = f"{img_name},{result}"
#     # print(f"{save_name}")

#     return save_name




