import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  login() {
    console.log('hi');
    axios.get('/auth/devmtn');
  }

  render() {
    const callback = encodeURI('http://localhost:8001/api/auth/callback');
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a href={`http://localhost:8080?redirect=${callback}`}>Heyo</a>
        </header>
      </div>
    );
  }
}

export default App;
