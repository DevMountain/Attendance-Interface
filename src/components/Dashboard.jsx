import React, { Component } from "react";
import "./../styles/Dashboard.css";
import Nav from "./Nav";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
import CohortView from "./CohortView";

export default class Dashboard extends Component {
  state = {
    selectedCohort: "",
    cohortList: [],
    // currentDate: moment().format('MM-DD-YYYY'),
    currentDate: "8/31/18",

    cohortData: []
  };

  componentDidMount() {
    axios
      .post("/api/getCohort", { date: this.state.currentDate, cohort: "WPR39" })
      .then(res => {
        this.setState({
          cohortData: res.data
        });
      });
  }

  render() {
    return (
      <>
        <Nav render={cohort => <CohortView cohort={cohort} />} />
      </>
    );
  }
}
