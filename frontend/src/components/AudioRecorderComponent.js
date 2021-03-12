import React, { useState } from "react";
import axios from "axios";

import { serverURL } from "../utils/serverInfo";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";

function AudioRecorder(props) {
  const [recordState, setRecordState] = useState(null);
  const [blobWavFileURL, setBlobWavFileURL] = useState("");

  const [sampleRate, setSampleRate] = useState(0);
  const [bpm, setBpm] = useState(0);
  const [sheetsTitle, setSheetsTitle] = useState("");

  const startRecording = () => {
    setRecordState(RecordState.START);
  };

  const stopRecording = () => {
    setRecordState(RecordState.STOP);
  };

  const saveRecordingURL = (audioData) => {
    //audioData contains blob and blobUrl
    setBlobWavFileURL(audioData.url);
  };

  const submitForm = (event) => {
    event.preventDefault();
    // first of all, create the wav file from the blob
    const fileName = Math.random().toString(36).substring(6) + "_name.wav"; // random
    const wavFile = new File(blobWavFileURL, fileName);

    // creating form data to contain file
    const formData = new FormData();

    // attach wav file to form data
    formData.append("file", wavFile);

    // now attach music's metadata
    const fileDataObject = {
      sample_rate: sampleRate,
      bpm: bpm,
      sheets_title: sheetsTitle,
    };
    formData.append("file_data", fileDataObject);

    axios
      .post(`${serverURL}/proccess_audio`, formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <AudioReactRecorder state={recordState} onStop={saveRecordingURL} />

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
