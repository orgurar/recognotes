import React, { useState, useEffect } from "react";
import { Document } from "react-pdf";

import Swal from "sweetalert2";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

import AudioSubmitDialogComponent from "./AudioSubmitDialogComponent";

import { Typography, Grid, Button, Badge, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";

import "./AudioRecorder.css";
import ArrowRightAlt from "@material-ui/icons/ArrowRightAlt";

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
    fontSize: 18,
    color: "white",
    borderRadius: 15,
    position: "absolute",
    right: 40,
    top: 55,
    padding: "5px 15px",
    "&:hover": {
      color: "black",
      backgroundColor: "white",
    },
  },
});

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

  const [sampleRate, setSampleRate] = useState(44100);
  const [bpm, setBpm] = useState(120);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [pdfLink, setPdfLink] = useState("");
  const [pdfReady, setPdfReady] = useState(false);

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
    setSampleRate(44100);
    setBpm(120);
  };

  const getScreenSize = (screenPercentage) => {
    return width * screenPercentage;
  };

  const onLinkReady = (pdfLink) => {
    setDialogOpen(false);
    setPdfLink(pdfLink);
    setPdfReady(true);
    console.log("LINK", pdfLink);
  };

  return (
    <div className="root">
      <>
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

          <Button
            className={classes.submitButton}
            endIcon={<ArrowRightAlt style={{ fontSize: 30, marginTop: -4 }} />}
            onClick={() => setDialogOpen(true)}
          >
            I'm Ready
          </Button>

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
        </Grid>

        <AudioSubmitDialogComponent
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
          bpm={bpm}
          sampleRate={sampleRate}
          wavfileBlob={wavfileBlob}
          onLinkReady={onLinkReady}
        />

        {pdfReady && <Document file={pdfLink} />}
      </>
    </div>
  );
}

export default AudioRecorder;
