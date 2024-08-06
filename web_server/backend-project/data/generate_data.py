from re import S
from sklearn import datasets
import numpy as np
import os
import argparse
import pandas as pd
import math
from random import randrange

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

def generate_data(n_samples: int, type: str, save_dir: str):
    if type == "blobs":
        data, _ = datasets.make_blobs(n_samples=n_samples, random_state=8)
    elif type == "moons":
        data, _ = datasets.make_moons(n_samples=n_samples, noise=0.05)
    elif type == "circles":
        data, _ = datasets.make_circles(n_samples=n_samples, factor=0.5, noise=0.05)
    elif type == "bubbles":
        data = get_bubbles(5)
    else:
        raise ValueError("No dataset type was provided.")
    df = pd.DataFrame(data, columns=["X1", "X2"])
    df.to_csv(os.path.join(save_dir, f"dataset_{type}.csv"), index=False)

    # np.savetxt(os.path.join(save_dir, f"dataset_{type}.csv"), data, delimiter=",")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--save_dir", type=str, help="Directory path where to save the generated data"
    )
    parser.add_argument(
        "--sample_size", type=int, help="Number of points in the generated dataset"
    )
    parser.add_argument(
        "--type",
        type=str,
        help="Type of dataset to generate",
        choices=["blobs", "moons", "circles", "bubbles"],
    )
    args = parser.parse_args()
    generate_data(n_samples=args.sample_size, type=args.type, save_dir=args.save_dir)
