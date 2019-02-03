import React, { Component } from 'react';
import './App.css';
import Bio from './components/Bio';
import Books from './components/Books';
import Checkins from './components/Checkins';
import Workouts from './components/Workouts';

class App extends Component {
  public render() {
    return (
      <>
        <Bio />
        <Checkins />
        <Books />
        <Workouts />
      </>
    );
  }
}

export default App;
