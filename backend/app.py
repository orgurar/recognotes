from flask import Flask, request, abort, jsonify
import flask_utils as utils

import os
import json

from cerberus import Validator
from werkzeug.utils import secure_filename

# import noise_engine as ne
from main import main as audio_main


app = Flask(__name__)
UPLOADS_DIR = "tmp_wavfiles"


@app.route('/proccess_audio', methods=['POST'])
def proccess_audio():
    '''
    '''
    # make a schema and validate data
    DATA_VALIDATION = {
        'sample_rate': {'type': 'integer', 'required': True},
        'bpm': {'type': 'integer', 'required': True},
        'sheets_title': {'type': 'string', 'required': True}
    }

    # # read data from POST request as python dict
    request_data = request.form['file_data']
    request_data = json.loads(request_data)

    # # validate data
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
        '.', UPLOADS_DIR, secure_filename(wavfile.name + '.wav'))
    wavfile.save(wavfile_path)

    # getting the np array of the wav file and fs of the file
    audio_content, sample_rate = utils.get_wav_content(
        wavfile_path, request_data['sample_rate'])

    # calling main function
    audio_main(audio_content, sample_rate, False,
               request_data['bpm'], request_data['sheets_title'])

    # creating a path for pdf output file
    wavfile_pdf_path = os.path.join(
        '.', UPLOADS_DIR, secure_filename(wavfile.name + '.pdf'))

    return jsonify('success: success')
