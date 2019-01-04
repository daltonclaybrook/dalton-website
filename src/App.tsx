import React, { Component } from 'react';
import './App.css';
import Bio from './components/Bio';
import Books from './components/Books';
import logo from './logo.svg';

class App extends Component {
  public render() {
    return (
      <>
        <Bio />
        <Books />
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </>
    );
  }
}

export default App;
