import React, { useState } from "react";
import axios from "axios";

import { serverURL } from "../utils/serverInfo";

import {
  Dialog,
  DialogTitle,
  TextField,
  Typography,
  DialogContent,
  Button,
  Grid,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";

import { Audio } from "@agney/react-loading";

const useStyles = makeStyles({
  dialogTitle: {
    fontWeight: "bold",
    fontSize: 26,
    color: "white",
  },
  secondaryText: {
    color: "white",
    fontSize: "85%",
  },
  textField: {
    marginTop: 30,
  },
  submitForm: {
    backgroundColor: "white",
    color: "black",
    marginTop: 30,
    padding: "15px 0",
    width: 230,
    borderRadius: 50,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

function AudioSubmitDialogComponent(props) {
  const classes = useStyles();
  const { open, onClose } = props;
  const { bpm, sampleRate, wavfileBlob } = props;

  const [sheetsTitle, setSheetsTitle] = useState("");

  const [uiLoading, setUiLoading] = useState(false);

  const submitForm = (event) => {
    event.preventDefault();
    setUiLoading(true);

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
        props.onLinkReady(fileURL);
        // window.open(fileURL);
      })
      .catch((error) => {
        console.error(error);
        setUiLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        PaperProps={{
          style: {
            backgroundColor: "#333333",
            minWidth: 450,
            minHeight: 350,
          },
        }}
      >
        <DialogTitle>
          <Grid
            container
            direction="column"
            display="flex"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Typography className={classes.dialogTitle}>
                One More Stage ;)
              </Typography>
            </Grid>

            <Grid item style={{ marginTop: -15 }}>
              <Typography variant="p" className={classes.secondaryText}>
                We need a few more things to sumbit
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={submitForm} noValidate>
            <Grid
              container
              direction="column"
              display="flex"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <CssTextField
                  placeholder="Music Sheets Title Here..."
                  lable="Sheet's Title"
                  variant="outlined"
                  value={sheetsTitle}
                  onChange={(event) => {
                    setSheetsTitle(event.target.value);
                  }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                  className={classes.textField}
                />
              </Grid>
              <Grid item>
                <Button type="submit" className={classes.submitForm}>
                  {uiLoading ? <Audio width={15} /> : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default AudioSubmitDialogComponent;
