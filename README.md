# RecogNotes

Audio analyzer and notes detection for musicians.
RecogNotes software will listen to your music through the microphone,
and create your music sheets in the easiest way possible.
Using our unique algorithm, this process is easy and reliable,
and will serve your needs.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Before you continue, read [Running Options](#running-options) and decide which way you whould like to run the software.

Then, check [Prerequisites](#Prerequisites) for an early manual installations.

### Prerequisites

Recognotes runs on the python3.8, please make sure you have this or a newer version available on your machine.

Also, on an Ubuntu machine, download the following items using the commands below

```
sudo apt-get install lilypond
sudo apt-get install ffmpeg libav-tools
```

## Running Options

Recognotes software can be run in two main options.

### CLI Application

Using your preferred Command Line Interface, you can start recognotes as a python module.

The CLI Tool will use python to record your audio, and to detect the notes sheets. It will create a `pdf` file using lilypond and pop it to the screen when is ready.

To run the application, after cloning the repo, cd into '/recognotes' and start the main file using python.

#### Installing

Install every requiered python module to run the CLI software by using the following commands.

We recommend creating a new python virtual enviroment

```
# creating and activating python venv
python3 -m venv venv
source venv/bin/activate

# download required modules
pip install -r requirements.txt
```

#### Running The CLI Application

After installing the needed dependencies, you can run the software on your machine

```
cd recognotes/
python main.py
```

Moreover, to get the full usage instructions, use may use the following command

```
python main.py -h
```

### Running Tests

In 'test-wavfiles' folder, you will find some unique-frequency `.wav` file in different sample rates.
As we mentioned in the usage instructions, you can specify the file and sample rate you would like to try.

For example, run the software with the 1000.wav file in the 44.1kHz dir:

```
cd recognotes/
python main.py -f ../test-wavfiles/44.1kHz/1000.wav -s 44100
```

### Web Application

Recognotes also has a web application you can use.

The web application will record the audio at the client side, using `JavaScript`, and then send it to a `flask` server to analyze it and create the `pdf` output file. When the file return to the web service, it will create a new blank tab and show it to the user.

In order to run it locally, you should run both backend and frontend at the same time.

#### Backend Installation and Activation

Install every requiered python module to run the server side software by using the following commands.

We recommend creating a new python virtual enviroment

```
# backend directory
cd backend/

# creating and activating python venv
python3 -m venv venv
source venv/bin/activate

# download required modules
pip install -r requirements.txt

# deactivate venv
deactivate

# start server at loaclhost:5000 using our script
sudo chmod +x ./start-server
./start-server
```

#### Frontend Installation and Activation

In order to install frontend dependencies, you just have to install the required `npm` packages, then run the web client using `npm start`

```
# frontend directory
cd frontend/

# install npm packages
npm i

# start frontend at localhost:3000
npm start
```

### Output

RecogNotes will show a pdf file on screen that contains your musical sheet output. It will open automatically in a new blank tab.

## Built With

### Recognotes Engine

- [crepe](https://github.com/marl/crepe) - monophonic pitch tracker based on a deep convolutional neural network
- [Abjad](https://github.com/Abjad/abjad) - wraps the LilyPond music notation package
- [NumPy](https://numpy.org/) - package for scientific computing and audio reading
- [scipy](https://www.scipy.org/) - wavfile I/O tool

### Web Interface

- [React](https://github.com/facebook/react) - a JavaScript library for building user interfaces.
- [Material-UI](https://material-ui.com/) - React components for faster and easier web development.
- [Axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js

### CLI Tool

- [argparse](https://docs.python.org/3/library/argparse.html) - Parser for command-line options, arguments and sub-commands.

## Authors

- **Or Amit Landesman** - Owner and Developer -[oramit1](https://gitlab.com/oramit1)
- **Or Gur Arie** - Owner and Developer - [orgurar](https://gitlab.com/orgurar)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
