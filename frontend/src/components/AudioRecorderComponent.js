import React, { useState } from "react";
import axios from "axios";

import { serverURL } from "../utils/serverInfo";
import useWindowDimensions from "../utils/windowDimensions";

import Swal from "sweetalert2";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

import { Typography, IconButton, TextField } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";

import Metronome from "@kevinorriss/react-metronome";

import "./AudioRecorder.css";

const useStyles = makeStyles({
  formButton: {
    position: "absolute",
    margin: "auto",
    left: 0,
    right: 0,
    backgroundColor: "white",
    color: "black",
    "&:hover": {
      backgroundColor: "transparent",
      color: "white",
    },
  },
  recordButtonIcon: {
    fontSize: 80,
    padding: 10,
  },
  whiteColored: {
    color: "white",
    textAlign: "center",
  },
});

const CssTextField = withStyles({
  root: {
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
        borderRadius: 50,
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);

function AudioRecorder(props) {
  const classes = useStyles();

  const { width } = useWindowDimensions();

  const [recordState, setRecordState] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [sampleRate, setSampleRate] = useState(44100);
  const [bpm, setBpm] = useState(100);

  const startRecording = () => {
    setRecordState(RecordState.START);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setRecordState(RecordState.STOP);
    setIsRecording(false);
  };

  const saveRecording = (audioData) => {
    //audioData contains blob and blobUrl
    setSampleRate(44100);

    Swal.fire({
      // Swal properties
      icon: "success",
      title: '<span style="color: white">Recording Saved!</span>',
      text:
        "Please Enter the Title for the Output Audio Sheets...\n You can press cancel and record again",
      input: "text",
      inputPlaceholder: "Enter Your Title Here",
      showCancelButton: true,

      // input validator
      inputValidator: (value) => {
        if (!value) {
          return "Title cannot be empty!";
        }
      },

      // styles
      confirmButtonColor: "white",
      confirmButtonText: '<span style="color: #191919">Submit</span>',
      cancelButtonColor: "white",
      cancelButtonText: '<span style="color: #191919">Cancel</span>',
      customClass: "swal-confirm",

      // onSubmit
      preConfirm: (title) => {
        // first of all, create the wav file from the blob
        const fileName = Math.random().toString(36).substring(6) + "_name.wav"; // random
        const wavFile = new File([audioData.blob], fileName);

        // creating form data to contain file
        const formData = new FormData();

        // attach wav file to form data
        formData.append("file", wavFile);

        // strings are easier to send and recieve via form data
        const fileDataString = `{
          "sample_rate": ${sampleRate},
          "bpm": ${bpm},
          "sheets_title": "${title}"
        }`;

        formData.append("file_data", fileDataString);

        return axios
          .post(`${serverURL}/proccess_audio`, formData, {
            responseType: "blob",
          })
          .then((response) => {
            // save response as PDF blob
            const file = new Blob([response.data], { type: "application/pdf" });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            window.open(fileURL);
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
    });
  };

  return (
    <div class="root">
      <Typography variant="h2" className={classes.whiteColored}>
        RecogNotes
      </Typography>
      <Typography variant="h6" className={classes.whiteColored}>
        Press
        <MicIcon style={{ fontSize: 20 }} />
        to Start Recording
      </Typography>

      <CssTextField
        variant="outlined"
        value={bpm}
        onChange={(event) => {
          const input = event.target.value;
          // if (!isNaN(input) && !isNaN(parseFloat(input)) && parseInt(input))
          setBpm(parseInt(input));
        }}
        label="Recording BPM"
        style={{
          position: "absolute",
          left: "50%",
          top: "33%",
          transform: "translate(-50%, -50%)",
        }}
        InputProps={{
          style: { color: "white" },
        }}
        // validator={(input) => {
        // if (isNaN(input) || isNaN(parseFloat(input))) return false;
        // return parseInt(input) > 0;
        // }}
      />

      <div style={{ marginTop: "15vh" }}>
        {isRecording ? (
          <IconButton onClick={stopRecording} className={classes.formButton}>
            <StopIcon className={classes.recordButtonIcon} />
          </IconButton>
        ) : (
          <IconButton onClick={startRecording} className={classes.formButton}>
            <MicIcon className={classes.recordButtonIcon} />
          </IconButton>
        )}
      </div>

      <div style={{ height: "25vh" }}>
        <br />
      </div>

      {/* <Metronome /> */}

      <AudioReactRecorder
        state={recordState}
        onStop={saveRecording}
        canvasHeight={150}
        canvasWidth={width}
        foregroundColor="white"
        backgroundColor="#191919"
      />
    </div>
  );
}

export default AudioRecorder;
