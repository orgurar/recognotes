import React, { useState, useRef } from "react";
import axios from "axios";

import { serverURL } from "../utils/serverInfo";

import useWindowDimensions from "../utils/windowDimensions";
import CssTextField from "./CssTextField";
import IOSSwitch from "./IOSSwitch";

import Swal from "sweetalert2";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

import { Typography, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MicIcon from "@material-ui/icons/Mic";
import StopIcon from "@material-ui/icons/Stop";

import Metronome from "./Metronome";

import "./css/AudioRecorder.css";
import "./css/swal.css";

const useStyles = makeStyles({
  formButton: {
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
  },
});

function AudioRecorder(props) {
  const sampleRate = 44100;
  const classes = useStyles();

  const { width } = useWindowDimensions();

  const [recordState, setRecordState] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const [bpm, setBpm] = useState(100);

  const metronomeRef = useRef();
  const [useMetronome, setUseMetronome] = useState(true);

  const startRecording = () => {
    useMetronome && metronomeRef.current.startStop();
    setRecordState(RecordState.START);
    setIsRecording(true);
  };

  const stopRecording = () => {
    useMetronome && metronomeRef.current.startStop();
    setRecordState(RecordState.STOP);
    setIsRecording(false);
  };

  const saveRecording = (audioData) => {
    //audioData contains blob and blobUrl

    Swal.fire({
      // Swal properties
      icon: "success",
      title: '<span style="color: white">Recording Saved!</span>',
      text: "Please Enter the Title for the Output Audio Sheets...\n You can press cancel and record again",
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
            console.log("HERE");
            console.error(error);
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
    });
  };

  return (
    <div id="root">
      <div id="row" className="no-margin">
        <IOSSwitch
          checked={useMetronome}
          onChange={(event) => {
            setUseMetronome(event.target.checked);
          }}
        />
        <span style={{ color: "white" }}>
          Metronome:{" "}
          <span style={{ color: "#bebebe" }}>
            {useMetronome ? "On" : "Off"}
          </span>
        </span>
      </div>
      <div>
        <Typography variant="h2" className={classes.whiteColored}>
          RecogNotes
        </Typography>
        <Typography variant="h6" className={classes.whiteColored}>
          Press
          <MicIcon style={{ fontSize: 20 }} />
          to Start Recording
        </Typography>
      </div>

      <div>
        <CssTextField
          variant="outlined"
          label="Recording BPM"
          value={bpm}
          onChange={(event) => {
            setBpm(parseInt(event.target.value));
          }}
          InputProps={{
            className: classes.whiteColored,
          }}
        />
      </div>

      <div>
        {isRecording ? (
          <IconButton onClick={stopRecording} className={classes.formButton}>
            <StopIcon className={classes.recordButtonIcon} />
          </IconButton>
        ) : (
          <IconButton onClick={startRecording} className={classes.formButton}>
            <MicIcon className={classes.recordButtonIcon} />
          </IconButton>
        )}

        <Metronome ref={metronomeRef} />

        <AudioReactRecorder
          state={recordState}
          onStop={saveRecording}
          canvasHeight={150}
          canvasWidth={width}
          foregroundColor="white"
          backgroundColor="#191919"
        />
      </div>
    </div>
  );
}

export default AudioRecorder;
