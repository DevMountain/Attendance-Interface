import React, { Component } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRouteStaff from './PrivateRouteStaff';

export default class routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <PrivateRouteStaff path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}
