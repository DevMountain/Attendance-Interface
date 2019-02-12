import React, { Component } from "react";
import "./../styles/Nav.css";
import { withRouter } from "react-router-dom";
import DevMtnLogo from "./../assets/MarkBlue@2x.png";
import { Link } from "react-router-dom";
import CohortSelector from './CohortSelector'
import axios from 'axios'

class Nav extends Component {
  state = { 
    cohorts: [],
    selectedCohort: 'WPR39',
    location: '' 
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
  render() {
    const {cohorts, selectedCohort, location} = this.state
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
          {this.props.render ? 
          (
            this.props.render(selectedCohort)
          )
          :
          (
            this.props.children
          )
          }
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Nav);
