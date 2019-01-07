import React, { Component } from 'react';
import './App.css';
import Bio from './components/Bio';
import Books from './components/Books';
import Checkins from './components/Checkins';

class App extends Component {
  public render() {
    return (
      <>
        <Bio />
        <Books />
        <Checkins />
      </>
    );
  }
}

export default App;
