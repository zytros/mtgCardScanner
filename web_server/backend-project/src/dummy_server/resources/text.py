import os
import json

from flask_restful import Resource

class ContentResource(Resource):

    def get(self):
        path_name = os.path.join(os.environ["DATA_PATH"], "blog_contents", f"content.json")
        print(path_name)
        with open(path_name, "r", encoding='utf-8') as file:
            data = json.load(file)
        return data
