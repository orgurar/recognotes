import flask_functions as fk

from flask import Flask
app = Flask(__name__)

# handles .wav file and make .pdf musical notes results
app.add_url_rule('/proccess_audio', 'proccess_audio', fk.proccess_audio, methods=['POST'])
