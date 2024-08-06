import os
import pandas as pd
import math

from random import randrange
from flask_restful import Resource
from sklearn.cluster import KMeans

class DatasetResource(Resource):
    def get(self, name):
        def get_points_in_circle(center, radius):
            points = []
            radius = radius + 1
            for angle in range(0, 360):
                x = center[0] + radius * math.cos(angle * math.pi / 180)
                y = center[1] + radius * math.sin(angle * math.pi / 180)
                points.append([x, y])
            return points

        def get_bubbles(bubs):
            p = []
            for i in range(1, bubs):
                print(i)
                p = p + get_points_in_circle((randrange(10),randrange(10)), randrange(3))
            return p
        
        if name == "bubbles":
            df = pd.DataFrame(get_bubbles(5), columns=["X1", "X2"])
            df.to_csv(os.path.join(os.environ["DATA_PATH"], f"dataset_{name}.csv"), index=False)

        path_name = os.path.join(os.environ["DATA_PATH"], f"dataset_{name}.csv")
        print(path_name)
        data = pd.read_csv(path_name)

        # process the data, e.g. find the clusters
        kmeans = KMeans(n_clusters=2, n_init=10, random_state=0).fit(data)
        labels = kmeans.labels_.tolist()
        
        # Add cluster to data
        data["cluster"] = labels

        # Convert to dictionary
        return data.to_dict(orient="records")
