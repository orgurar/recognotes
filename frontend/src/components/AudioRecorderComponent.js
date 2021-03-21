import React, { useState, useEffect } from "react";
import axios from "axios";

import Swal from "sweetalert2";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

import {
  Typography,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Badge,
  IconButton,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";

import { serverURL } from "../utils/serverInfo";

import "./AudioRecorder.css";

const useStyles = makeStyles({
  root: {
    marginTop: 10,
  },
  formButton: {
    backgroundColor: "white",
    color: "black",
    "&:hover": {
      backgroundColor: "transparent",
      color: "white",
    },
  },
  recordButtonIcon: {
    fontSize: 60,
    padding: 10,
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
  uiLoading: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  submitButton: {
    color: "white",
    position: "absolute",
    right: 30,
    top: 50,
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
        borderRadius: 50, // <div className="root" style={{ filter: "blur(0px)" }}>
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
    },
  },
})(TextField);

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function AudioRecorder(props) {
  const classes = useStyles();

  const { width } = useWindowDimensions();

  const [hasRecorded, setHasRecorded] = useState(false);

  const [recordState, setRecordState] = useState(null);
  const [wavfileBlob, setWavfileBlob] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  const [uiLoading, setUiLoading] = useState(false);

  const [sampleRate, setSampleRate] = useState(44100);
  const [bpm, setBpm] = useState(120);
  const [sheetsTitle, setSheetsTitle] = useState("");

  const startRecording = () => {
    setRecordState(RecordState.START);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setRecordState(RecordState.STOP);
    setHasRecorded(true);
    setIsRecording(false);
    Swal.fire({
      icon: "success",
      title: "Recording Saved!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const saveRecording = (audioData) => {
    //audioData contains blob and blobUrl
    setWavfileBlob(audioData);
  };

  const submitForm = (event) => {
    event.preventDefault();

    setUiLoading(true);
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
        setUiLoading(false);
        window.open(fileURL);
      })
      .catch((error) => {
        console.error(error);
        setUiLoading(false);
      });
  };

  const getScreenSize = (screenPercentage) => {
    return width * screenPercentage;
  };

  return (
    <div className="root">
      {uiLoading ? (
        <div className={classes.uiLoading}>
          <CircularProgress size={100} />
        </div>
      ) : (
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
              style={{ fontWeight: "bold" }}
            >
              RecogNotes
            </Typography>
            <Typography variant="h6" className={classes.whiteColored}>
              Press <MicIcon style={{ fontSize: 20 }} /> to Start Recording
            </Typography>
          </Grid>

          <Button className={classes.submitButton}>Continue</Button>

          <Grid
            item
            container
            direction="column"
            alignItems="left"
            justify="left"
          >
            <Grid item style={{ left: 0, marginTop: "10%" }}>
              <AudioReactRecorder
                state={recordState}
                onStop={saveRecording}
                canvasHeight={150}
                canvasWidth={getScreenSize(0.64)}
                foregroundColor="white"
                backgroundColor="#191919"
              />
            </Grid>
          </Grid>

          <Grid item>
            {isRecording ? (
              <IconButton
                onClick={stopRecording}
                className={classes.formButton}
              >
                <MicOffIcon className={classes.recordButtonIcon} />
              </IconButton>
            ) : (
              <Badge variant="dot" color="primary" invisible={!hasRecorded}>
                <IconButton
                  onClick={startRecording}
                  className={classes.formButton}
                >
                  <MicIcon className={classes.recordButtonIcon} />
                </IconButton>
              </Badge>
            )}
          </Grid>

          {/* <form onSubmit={submitForm} noValidate>
            <Grid
              item
              container
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Grid item className={classes.gridColItem}>
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

              <Grid item className={classes.gridColItem}>
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
          </form> */}
        </Grid>
      )}
    </div>
  );
}

export default AudioRecorder;
