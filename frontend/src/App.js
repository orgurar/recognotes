import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AudioRecorder from "./components/AudioRecorderComponent";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AudioRecorder} />
      </Switch>
    </Router>
  );
}

export default App;
