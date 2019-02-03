import React, { Component } from 'react';
import './App.css';
import Bio from './components/Bio';
import Books from './components/Books';
import Checkins from './components/Checkins';
import Links from './components/Links';
import Workouts from './components/Workouts';

class App extends Component {
  public render() {
    return (
      <>
        <Bio />
        <Links />
        <Books />
        <Checkins />
        <Workouts />
      </>
    );
  }
}

export default App;
