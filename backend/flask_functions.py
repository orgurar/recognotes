from flask import request
import json


def proccess_audio():
    # read data from POST request as python dict
    request_data = request.data.decode()
    json_request_data = json.loads(request_data)

    print(json_request_data)
    return json_request_data
