import { Component } from 'react';
import './App.css';
import Bio from './components/Bio';
import Books from './components/Books';

class App extends Component {
  public render() {
    return (
      <>
        <Bio />
        <Books />
      </>
    );
  }
}

export default App;
