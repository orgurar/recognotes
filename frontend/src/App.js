import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AudioRecorder from "./components/AudioRecorderComponent";
import Test from "./components/test";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={AudioRecorder} />
        <Route exact path="/test/" component={Test} />
      </Switch>
    </Router>
  );
}

export default App;
