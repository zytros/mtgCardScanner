from flask_restful import Api
import dummy_server.resources as res

API = "/api/v1/"  # optional string


def add_routes(app):
    api = Api(app)

    api.add_resource(res.scatter_data.DatasetResource, API + "data/<string:name>")
    api.add_resource(res.app_info.Environment, API + "app_info")
    # api.add_resource(res.app_info.Dragons, API + "dragons")

    return api
