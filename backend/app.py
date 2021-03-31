from flask import Flask, request, abort, jsonify, send_file, send_from_directory
from flask_cors import CORS
import flask_utils as utils

import os
import json

from cerberus import Validator
from werkzeug.utils import secure_filename

# main function from recognotes
from main import main as audio_main


# app = Flask(__name__, static_url_path='', static_folder='build')
app = Flask(__name__)
CORS(app)

app.config['UPLOADS_DIR'] = "./tmp_wavfiles"


# @app.route("/", defaults={'path': ''})
# def serve(path):
# return send_from_directory(app.static_folder, 'index.html')


@app.route('/proccess_audio', methods=['POST'])
def proccess_audio():
    '''
    Function Description Here
    '''
    # make a schema in order to validate JSON request data
    DATA_VALIDATION = {
        'sample_rate': {'type': 'integer', 'required': True},
        'bpm': {'type': 'integer', 'required': True},
        'sheets_title': {'type': 'string', 'required': True}
    }

    # read data from POST request as python dict
    request_data = request.form['file_data']
    request_data = json.loads(request_data)

    # validate data
    json_validator = Validator(DATA_VALIDATION)
    if not json_validator.validate(request_data):
        # data is invalid
        abort(400)

    if 'file' not in request.files:
        # data is invalid
        abort(400)

    # saving file as a temporary file
    wavfile = request.files['file']
    wavfile_path = os.path.join(
        app.config['UPLOADS_DIR'], secure_filename(wavfile.name + '.wav'))
    # also creates the path for the PDF file
    output_pdf_path = os.path.join(
        app.config['UPLOADS_DIR'], secure_filename(wavfile.name + '.pdf'))
    wavfile.save(wavfile_path)

    # getting the np array of the wav file and fs of the file
    audio_content, sample_rate = utils.get_wav_content(
        wavfile_path, request_data['sample_rate'])

    if type(audio_content) is dict and 'error' in audio_content:
        # invalid
        print(audio_content['error'])
        abort(500)

    # calling main function
    audio_main(audio_content, sample_rate, False,
               request_data['bpm'], request_data['sheets_title'], output_pdf_path)

    # sending back PDF file using its path
    try:
        return send_file(output_pdf_path)
    except FileNotFoundError:
        abort(404)