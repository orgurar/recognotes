#!/bin/bash

# load virtual enviroment
source ./venv/bin/activate

# start flask server
export FLASK_APP=app.py
flask run