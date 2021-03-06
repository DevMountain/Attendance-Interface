import React, { Component } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard'
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRouteStaff from './PrivateRouteStaff';
import PrivateRouteStudent from './PrivateRouteStudent';

export default class routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <PrivateRouteStaff path="/student/:id" component={StudentDashboard} />
          <PrivateRouteStaff path="/dashboard" component={Dashboard} />
          <PrivateRouteStudent path="/student/" component={StudentDashboard} />
        </Switch>
      </Router>
    );
  }
}
