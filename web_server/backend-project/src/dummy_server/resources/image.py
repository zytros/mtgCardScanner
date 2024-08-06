import os
import io

from flask import send_file
from flask_restful import Resource

class ImageResource(Resource):
    
    def get(self, name: str):
        # parse path if necessary
        path = name.split("...")
        path_name = os.path.join(os.environ["DATA_PATH"], "images", *path[:-1], f"{path[-1]}.png")
        print('sent img file', path_name)
        with open(path_name, 'rb') as bites:
            return send_file(
                io.BytesIO(bites.read()),
                # download_name='logo.png',
                mimetype='image/png'
        )
