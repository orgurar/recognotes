import React, { useState } from "react";
import axios from "axios";

import { serverURL } from "../utils/serverInfo";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

function AudioRecorder(props) {
  const [recordState, setRecordState] = useState(null);
  const [wavfileBlob, setWavfileBlob] = useState({});

  const [sampleRate, setSampleRate] = useState(0);
  const [bpm, setBpm] = useState(0);
  const [sheetsTitle, setSheetsTitle] = useState("");

  const startRecording = () => {
    setRecordState(RecordState.START);
  };

  const stopRecording = () => {
    setRecordState(RecordState.STOP);
  };

  const saveRecording = (audioData) => {
    //audioData contains blob and blobUrl
    setWavfileBlob(audioData);
  };

  const submitForm = (event) => {
    event.preventDefault();

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
        console.log(response);
        const file = new Blob([response.data], { type: "application/pdf" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
        window.open(fileURL);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <AudioReactRecorder state={recordState} onStop={saveRecording} />

      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>

      <br />
      <br />

      <form onSubmit={submitForm} noValidate>
        <label>
          Sample Rate:
          <input
            type="text"
            value={sampleRate}
            onChange={(event) => {
              setSampleRate(event.target.value);
            }}
          />
        </label>
        <br />
        <br />

        <label>
          BPM:
          <input
            type="text"
            value={bpm}
            onChange={(event) => {
              setBpm(event.target.value);
            }}
          />
        </label>
        <br />
        <br />

        <label>
          Sheets Title:
          <input
            type="text"
            value={sheetsTitle}
            onChange={(event) => {
              setSheetsTitle(event.target.value);
            }}
          />
        </label>
        <br />
        <br />

        <input type="submit" />
      </form>
    </div>
  );
}

export default AudioRecorder;
