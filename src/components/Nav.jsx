import React, { Component } from "react";
import "./../styles/Nav.css";
import { withRouter } from "react-router-dom";
import DevMtnLogo from "./../assets/MarkBlue@2x.png";
import { Link } from "react-router-dom";
import CohortSelector from "./CohortSelector";
import axios from "axios";
import moment from "moment";
import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";

class Nav extends Component {
  state = {
    cohorts: [],
    selectedCohort: "WPR39",
    location: "",
    selectedDate: "08/30/2018",
    dateModal: false
  };
  componentDidMount() {
    axios.get("/api/getAllCohorts").then(res => {
      this.setState({ cohorts: res.data });
    });
  }
  updateSelectedCohort = () => e => {
    this.setState({ selectedCohort: e.target.value });
  };
  updateLocation = () => e => {
    this.setState({ location: e.target.value });
  };
  updateSelectedCohort = () => e => {
    this.setState({ selectedCohort: e.target.value });
  };
  updateLocation = () => e => {
    this.setState({ location: e.target.value });
  };
  updateSelectedDate = date => {
    date = date.toLocaleDateString("en-US"); //turns Date object into string

    this.setState({ selectedDate: date, dateModal: false });
  };
  onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  render() {
    const { classes } = this.props;
    const {
      cohorts,
      selectedCohort,
      location,
      selectedDate,
      dateModal
    } = this.state;
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
              <div>
                <div className="attendance-date-container">
                  <h2 style={{ textAlign: "center", fontSize: "1.8rem" }}>
                    {selectedCohort} Attendance
                  </h2>
                  <button
                    className="date-button"
                    onClick={() => this.setState({ dateModal: true })}
                  >
                    {selectedDate}
                  </button>
                </div>

                <div className="bottom-menu-dashboard">
                  <CohortSelector
                    cohorts={cohorts}
                    selectedCohort={selectedCohort}
                    location={location}
                    updateLocation={this.updateLocation}
                    updateSelectedCohort={this.updateSelectedCohort}
                  />

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
              </div>
            ) : (
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="botton-menu-student"
              >
                <h2>
                  <span>
                    <Link style={{ color: "white" }} to="/dashboard">
                      <i className="arrow-left fas fa-arrow-left" />
                    </Link>
                  </span>
                  Cohort View
                </h2>
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
            )}
          </div>
          <div className="attendance-container">
            {this.props.render
              ? this.props.render(selectedCohort, selectedDate)
              : this.props.children}
          </div>
          {dateModal && (
            <div
              className="modal-date-picker"
              onClick={() => this.setState({ dateModal: false })}
            >
              <div onClick={e => e.stopPropagation()}>
                <InfiniteCalendar
                  theme={{
                    floatingNav: {
                      background: "#333333",
                      chevron: "transparent",
                      color: "white"
                    },
                    accentColor: "black",
                    headerColor: "#333333",
                    weekdayColor: "#2aabe2",
                    selectionColor: "#2aabe2",
                    todayColor: "#333333"
                  }}
                  width={600}
                  height={400}
                  selected={selectedDate}
                  onSelect={e => this.updateSelectedDate(e)}
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default withRouter(Nav);
