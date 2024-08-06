# Project Title

## Team Members
1. Anne Marx 
2. Diego Arapovic 
3. Luca Sichi
4. Yumi Kim 

## Link to first milestone video
https://drive.google.com/file/d/1ipWeoZ-yIk3AKxv7LSe6P1dKYJY8-Ryr/view?usp=sharing

## Link to Visual Encoding for second Milestone
https://docs.google.com/document/d/1sr8fU0Wl3nH0q7Z1NSz9e7p07bW-uzZQmcWExSzjU4E/edit#heading=h.g2icfiih9e2m
The working endpoint is fetching text and delivering it to the blogpost-frontend if requested by the frontend to keep data separate from the frontend. This will also make it easier to version the text chapters. The second working endpoint is sending images from the backend, which will be vital for visualizing the attribution visualization when the user selects a neuron. It's images are not connected from the frontend-side yet, but the backend can already send them.
The overall image saving structure in the backend is constructed in a way, that there are sorted input images (sorted by class to inspect biases over different classes), such as a jaguar and corresponding neuron activity images (image file name corresponds to layer and neuron index), such as attribution visualizations for specific input images. Over the course of the blog post, the structure may be expanded according to additional features and required data.

## Project description 
[Understanding Visual Bias in Vision Transformers]
In the past years, Vision Transformers have become increasingly popular for vision tasks. They perform as good as or even better than Convolutional Neural Networks and are therefore a promising alternative to CNNs. 

However, Vision Transformers, like many other Deep Neural Networks, are still a blackbox and we still do not fully understand, why Transformers perform well in vision tasks. 

One method to understand them better is to investigate visual biases. Visual Biases can for example be different features such as texture, color or shape, that the Vision transformer learns to correlate to a certain output, such as the class of jaguars. 

Biases are necessary for the network in order to achieve its vision task, however there are also biases that the network might learn, that we want to avoid. Depending on the training setup and the used dataset, the network might for example not recognize people from certain ethnical background as humans, which is a huge ethical concern.
### Users
Our main user is the Machine Learning engineer. Our goal is for the user to understand better, what a vision transformer classifier learns on a neural level and use this insight to improve the performance of the network.

### Tasks and Datasets 
To fulfill these User's need, we concentrate on the ViT transformer, which is a popular backbone for many vision tasks, and use it as a classifier. The ViT transformer in its smallest version consists of twelve transformer blocks which make it ideal to investigate vision transformers in general. We use a pretrained ViT, that was trained on ImageNet 21k and finetuned on ImageNet 1k. These are huge datasets consisting of 21'000 or 1'000 classes of animals, objects, and others.

Our final result, a blog post contains the following interactive visualizations:

At first, we visualize a simplified architecture of the ViT transformer to get the user familiar with the architecture.

Then, we guide the user through an investigation of global and modular bias using multiple methods and interactive elements.

## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
├── backend-project
│   ├── setup.py   # main app
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── MANIFEST.in
│   ├── README.md
│   ├── pyproject.toml
│   ├── data
│   │   ├── blog_contents
│   │   │   └── content.json # main content of our blogpost
│   │   └── images # precomputed images we display
│   └── src/dummy_server
│       ├── resources
│       │   ├── __init__.py
│       │   ├── image.py # resource for image
│       │   ├── occlusion_prediction_resource.py # resource for prediction method
│       │   ├── scatter_data.py # example
│       │   └── text.py # resource for text
│       ├── router
│       │   ├── __init__.py
│       │   ├── app.py 
│       │   └── routes.py # contain routes to resources
│       ├── scripts
│       │   ├── __init__.py
│       │   ├── cls2idx.py # dict of imageNet indices to class names
│       │   └── occlusion_prediction.py # does the occluded prediction
│       └── __init__.py
├── react-frontend
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── Banner_thin.png # our banner
│   │   ├── banner.png # also our banner
│   │   ├── components
│   │   │   ├── TypeScript.tsx # all our Type Script files
│   │   │   └── CSS.css # all our css files
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── router
│   │   │   ├── resources 
│   │   │   │   └── data.ts # our datatypes
│   │   │   └── apiClient.ts 
│   │   ├── setupTests.ts
│   │   └── types
│   │       ├── content.ts # content of our structured website
│   │       └── margins.ts
│   └── tsconfig.json
```

## Requirements
You need to have anaconda and nodejs installed
Furthermore, in the frontend you need to install the following npm packages:
- ```npm install react-loader-spinner --save```
- ```npm install jszip```
- ```npm install d3```


## How to Run

To run our code do the following:
- clone the repository;
- open a terminal instance and using the command ```cd``` move to the folder where the project has been downloaded;

To run the backend
- open the backend folder called "backend-project"
- to start the backend first you need to create a virtual environment using conda```conda create -n nameOfTheEnvironment```
- to activate the virtual environment run the command ```conda activate nameOfTheEnvironment```
- install the requirements using the command ```pip3 install .```
- run the backend with the command ```start-server```

To run the frontend
- Open a new terminal window and go to the project folder
- Enter the frontend folder called "react-frontend"
- Do the following command to start the front end ```npm install```, ```npm start```
- A browser window should open automatically, if not try opening Chrome and go to http://localhost:3000/


## Milestones
Document here the major milestones of your code and future planned steps.\
- [x] Week 1
  - [x] Completed Sub-task: [#c7c12c2d](https://gitlab.inf.ethz.ch/course-xai-iml24/c1-mechanistic-interpretability-cv/-/tree/c7c12c2d87531e8db3d2613b879f75a22695ac16)

- [x] Week 2
  - [x] Completed Sub-task: [#087d255a](https://gitlab.inf.ethz.ch/course-xai-iml24/c1-mechanistic-interpretability-cv/-/tree/087d255a7c5a452b121b771afd08df25159e575f)

- [x] Week 3
  - [x] Completed Sub-task: [#867dc556](https://gitlab.inf.ethz.ch/course-xai-iml24/c1-mechanistic-interpretability-cv/-/tree/867dc556d094f7e9e845cf95ba227b368c18ddba)

- [x] Week 4
  - [x] Completed Sub-task: [#5809cd78](https://gitlab.inf.ethz.ch/course-xai-iml24/c1-mechanistic-interpretability-cv/-/tree/5809cd7822965abc8d1238328920b36e6dc9ca01)

- [x] Week 5
  - [x] Completed Sub-task: [#daed9f7f](https://gitlab.inf.ethz.ch/course-xai-iml24/c1-mechanistic-interpretability-cv/-/tree/daed9f7f39290b641ff0fbb0694dd8608483a17f)


## Contribution
- all team members contributed equally to the project.
- Anne Marx: poster, Backend: adapt lucent for act.max. and att.score max., contributed to sending images and batchwise text. Frontend: structure, style, storyline, attention score max. visualization. 
- Diego Arapovic: research into XAI methods, Frontend: main structure of blog, rendering; conception and implementation of interactive elements. Backend: content layout, contributed to act.max. 
- Luca Sichi: Backend: gradient visualization, and occlusion prediction, contributed interface for sending images. Frontend: gradient visualization, occlusion prediction, contributed to sending images. Assisted team members.
- Yumi Kim: Backend: RLP. Frontend: Worked on visualizations for architecture, Act Max, research on XAI methods, texts for the blog
