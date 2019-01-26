import React, { Component } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import ContextConsumer from '../ContextConsumer'

const sso = `http://localhost:8080?redirect=${encodeURI('http://localhost:8001/api/auth/callback')}`

class App extends Component {
  componentDidMount = async () => {
    try {
      let { data } = await axios.get('/api/auth/login');
      this.props.context.actions.setData(data)
      if (data.role === 'staff') {
        this.props.history.push(`/dashboard/${data.cohortId}`)
      } else if (data.role === 'student') {
        this.props.history.push(`/student`)
      }
    }
    catch (err) {
      this.handleUnauthorized(err)
    }
  }

  handleUnauthorized = err => {
    const { status } = err.response
    if (status === 404) {
      window.location = sso
    }
    else if (status === 400) {
      swal({
        type: 'error',
        title: 'Oops...',
        icon: 'error',
        text: 'Please try logging in again, If the problem persists contact a DevMountain Employee.',
        dangerMode: true
      })
    } else if (status === 401) {
      axios.get('')
      swal({
        type: 'warn',
        title: 'Unauthorized',
        icon: 'warn',
        text: 'You are unothorized to use this site.',
        dangerMode: true
      })
    }
  }

  login = () => {
    window.location = sso;
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button onClick={this.login}>Login</button>
        </header>
      </div>
    );
  }
}

export default ContextConsumer(App);
