import React, { Component } from "react";
import "./../styles/Nav.css";
import { withRouter } from "react-router-dom";
import DevMtnLogo from "./../assets/MarkBlue@2x.png";
import { Link } from "react-router-dom";
import CohortSelector from "./CohortSelector";
import axios from "axios";
import moment from 'moment'
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: '5rem',
    marginRight: '5rem',
    width: 150,
  },
  grid: {
    width: '60%',
  }
});


class Nav extends Component {
  state = {
    cohorts: [],
    selectedCohort: 'WPR39',
    location: '',
    selectedDate:moment().format('YYYY-MM-DD') 
  }
  componentDidMount(){
    axios.get('/api/getAllCohorts').then(res => {
        this.setState({cohorts: res.data})
    })
  }
  updateSelectedCohort = () => (e) => {
    this.setState({selectedCohort: e.target.value})
  }
  updateLocation = () => (e) => {
    this.setState({location: e.target.value})
  }
  updateSelectedCohort = () => e => {
    this.setState({ selectedCohort: e.target.value });
  };
  updateLocation = () => e => {
    this.setState({ location: e.target.value });
  };
  updateSelectedDate = () => date => {
    this.setState({ selectedDate: date });
  };
  render() {
    const { classes } = this.props;
    const { cohorts, selectedCohort, location, selectedDate } = this.state;
    return (
      <>
        <div className="nav-main">
          <div className="logo-container">
            <img className="nav-logo" src={DevMtnLogo} alt="Dev Logo" />
            <h2>DevMountain Attendance</h2>
          </div>
        </div>
        <div className="student-main">
          <div className="menu-container">
            {this.props.match.path === "/dashboard" ? (
              <div className="select-container">
                <h2>Attendance for {selectedCohort}</h2>
                <CohortSelector 
                  cohorts={cohorts} 
                  selectedCohort={selectedCohort} 
                  location={location} 
                  updateLocation={this.updateLocation} 
                  updateSelectedCohort={this.updateSelectedCohort}
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container className={classes.grid} justify="space-around">
                    <DatePicker
                      margin="normal"
                      label="Date picker"
                      value={selectedDate}
                      onChange={this.updateSelectedDate()}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
           
              </div>
            ) : (
              <h2>
                <span>
                  <Link style={{ color: "white" }} to="/dashboard">
                    <i className="arrow-left fas fa-arrow-left" />
                  </Link>
                </span>
                Cohort View
              </h2>
            )}

            <h3>
              Carter Childs{" "}
              <span className="dropdown">
                <span>
                  <i className="down-arrow fas fa-chevron-down" />
                </span>
                <div className="dropdown-content">
                  <p>Log Out</p>
                </div>
              </span>
            </h3>
          </div>
          <div className="attendance-container">
            {this.props.render
              ? this.props.render(selectedCohort, selectedDate)
              : this.props.children}
          </div>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(withRouter(Nav))