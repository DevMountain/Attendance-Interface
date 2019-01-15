import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  check() {
    console.log('check');
    axios.get('/api/test');
  }

  render() {
    const redirect = encodeURI('http://localhost:8001/api/auth/callback');
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a className="App-link" href={`https://sso.devmountain.com/dashboard?redirect=${redirect}`}>
            Login
          </a>
          <button onClick={() => this.check()}>Heyo</button>
        </header>
      </div>
    );
  }
}

export default App;
