import React, { useState } from "react";
import axios from "axios";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

import { Typography, Grid, Button, TextField } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import { serverURL } from "../utils/serverInfo";

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
  formButton: {
    width: 100,
    fontSize: 18,
    backgroundColor: "rgb(245,211,114)",
    color: "white",
    borderRadius: 25,
  },
  whiteColored: {
    color: "white",
  },
  inputBase: {
    borderColor: "rgb(230,171,65)",
    height: "6vh",
    padding: 5,
  },
  gridColItem: {
    marginTop: 15,
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
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);

function AudioRecorder(props) {
  const classes = useStyles();

  const [recordState, setRecordState] = useState(null);
  const [wavfileBlob, setWavfileBlob] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  // const [uiLoading, setUiLoading] = useState(false);

  const [sampleRate, setSampleRate] = useState(44100);
  const [bpm, setBpm] = useState(120);
  const [sheetsTitle, setSheetsTitle] = useState("");

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
    setWavfileBlob(audioData);
  };

  const submitForm = (event) => {
    event.preventDefault();

    // setUiLoading(true)
    setSheetsTitle("new title");

    // first of all, create the wav file from the blob
    const fileName = Math.random().toString(36).substring(6) + "_name.wav"; // random
    const wavFile = new File([wavfileBlob.blob], fileName);

    // creating form data to contain file
    const formData = new FormData();

    // attach wav file to form data
    formData.append("file", wavFile);

    // strings are easier to send and recieve via form data
    const fileDataString = `{
      "sample_rate": ${sampleRate},
      "bpm": ${bpm},
      "sheets_title": "${sheetsTitle}"
    }`;
    formData.append("file_data", fileDataString);

    axios
      .post(`${serverURL}/proccess_audio`, formData, { responseType: "blob" })
      .then((response) => {
        // save response as PDF blob
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        // setUiLoading(false);
        window.open(fileURL);
      })
      .catch((error) => {
        console.error(error);
        // setUiLoading(false);
      });
  };

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid item>
        <Typography
          variant="h1"
          className={classes.whiteColored}
          style={{ marginRight: 28, fontWeight: "bold" }}
        >
          <span style={{ color: "rgb(191,234,230)" }}>Recog</span>
          <span style={{ color: "rgb(246,185,184)" }}>Notes</span>
        </Typography>
      </Grid>

      <Grid
        item
        container
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid
          item
          // style={{
          //   position: "absolute",
          //   right: 100,
          //   top: 250,
          // }}
        >
          <AudioReactRecorder
            state={recordState}
            onStop={saveRecording}
            canvasHeight={150}
            foregroundColor="rgb(190,226,222)"
            backgroundColor="rgb(246,185,184)"
          />
        </Grid>
        <Grid
          item
          // style={{
          //   position: "absolute",
          //   right: 300,
          //   top: 410,
          // }}
        >
          {isRecording ? (
            <Button onClick={stopRecording} className={classes.formButton}>
              Stop
            </Button>
          ) : (
            <Button onClick={startRecording} className={classes.formButton}>
              Start
            </Button>
          )}
        </Grid>
      </Grid>

      <form onSubmit={submitForm} noValidate>
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid
            item
            className={classes.gridColItem}
            // style={{
            //   position: "absolute",
            //   left: 300,
            //   top: 410,
            // }}
          >
            <CssTextField
              label="BPM"
              variant="outlined"
              value={bpm}
              onChange={(event) => {
                setBpm(event.target.value);
              }}
              InputProps={{
                className: classes.whiteColored,
              }}
            />
          </Grid>

          <Grid
            item
            className={classes.gridColItem}
            // style={{
            //   position: "absolute",
            //   left: 300,
            //   top: 480,
            // }}
          >
            <CssTextField
              label="Sample Rate"
              variant="outlined"
              value={sampleRate}
              onChange={(event) => {
                setSampleRate(event.target.value);
              }}
              InputProps={{
                className: classes.whiteColored,
              }}
            />
          </Grid>
          <Grid item className={classes.gridColItem}>
            <Button type="submit" className={classes.formButton}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}

export default AudioRecorder;
