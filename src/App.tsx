import React, { Component } from 'react';
import styled from 'styled-components';
import Bio from './components/Bio';
import Books from './components/Books';
import Checkins from './components/Checkins';
import Games from './components/Games';
import Workouts from './components/Workouts';
import Constants from './shared/Constants';

declare global {
  interface Window {
    hasGoogleLoaded: boolean;
    googleInit(): any;
  }
}

const AppWrapper = styled.div`
  margin: auto;
  max-width: ${Constants.contentMaxWidth + Constants.contentWidthPadding * 2}rem;
  padding: 2.625rem ${Constants.contentWidthPadding}rem;
  font-family: 'Roboto Mono', monospace;
`;

class App extends Component {
  public render() {
    return (
      <AppWrapper>
        <Bio />
        <Checkins />
        <Books />
        <Workouts />
        <Games />
      </AppWrapper>
    );
  }
}

export default App;
