import React, { Component } from "react";
import "./css/metronome.css";

const click1 = "//daveceddia.com/freebies/react-metronome/click1.wav";
const click2 = "//daveceddia.com/freebies/react-metronome/click2.wav";

class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      count: 0,
      bpm: 100,
      beatsPerMeasure: 4,
    };

    this.click1 = new Audio(click1);
    this.click2 = new Audio(click2);
  }

  handleInputChange = (event) => {
    const bpm = event.target.value;

    if (this.state.isPlaying) {
      // stop old timer and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

      // set the new bpm
      // and reset the beat counter
      this.setState({
        count: 0,
        bpm,
      });
    } else {
      // otherwise, just update the bpm
      this.setState({ bpm });
    }
  };

  playClick = () => {
    const { count, beatsPerMeasure } = this.state;

    // alternate click sounds
    if (count % beatsPerMeasure === 0) {
      this.click2.play();
    } else {
      this.click1.play();
    }

    // keep track of which beat we're on
    this.setState((state) => ({
      count: (state.count + 1) % state.beatsPerMeasure,
    }));
  };

  startStop = () => {
    if (this.state.isPlaying) {
      // stop the timer
      clearInterval(this.timer);
      this.setState({
        isPlaying: false,
      });
    } else {
      // start a timer with current bpm
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000);
      this.setState(
        {
          count: 0,
          isPlaying: true,
          // play a click immediately (after setState finishes)
        },
        this.playClick
      );
    }
  };

  render() {
    return <React.Fragment />;
  }
}

export default Metronome;
