from xplique.attributions import Saliency
from xplique.metrics import Deletion
from xplique.features_visualizations import Objective
from xplique.features_visualizations import optimize

# SWIN Transformer for classification

from transformers import TFSwinForImageClassification
# Initializing a Swin microsoft/swin-tiny-patch4-window7-224 style configuration
model = TFSwinForImageClassification.from_pretrained("microsoft/swin-tiny-patch4-window7-224")

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Feature Visualization
neuron_obj = Objective.neuron(model, "classifier", 100)
#channel_obj = Objective.layer(model, "mixed3", 10)

#obj = neuron_obj + 2.0 * channel_obj
images, obj_names = optimize(neuron_obj)