import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import Bio from './components/Bio';
import Books from './components/Books';
import Checkins from './components/Checkins';
import Google from './components/Checkins/Google';
import Games from './components/Games';
import Workouts from './components/Workouts';

declare global {
  interface Window {
    hasGoogleLoaded: boolean;
    googleInit(): any;
  }
}

const AppWrapper = styled.div`
  margin: auto;
  max-width: 54rem;
  padding: 2.625rem 1.3125rem;
  font-family: 'Roboto Mono', monospace;
`;

class App extends Component {
  public render() {
    return (
      <AppWrapper>
        <Bio />
        <Google />
        <Checkins />
        <Books />
        <Workouts />
        <Games />
      </AppWrapper>
    );
  }
}

export default App;
