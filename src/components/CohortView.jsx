import React, { Component } from "react";
import "./../styles/Dashboard.css";
import Nav from "./Nav";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";

export default class CohortView extends Component {
  state = {
    cohort: this.props.cohort,
    // currentDate: moment().format('MM-DD-YYYY'),
    currentDate: "8/31/18",
    cohortData: []
  };

  componentDidMount() {
    this.getCohortData()
  }
  componentDidUpdate(prevProps){
      if(prevProps.cohort !== this.props.cohort) this.getCohortData()
  }
  getCohortData = () => {
      console.log(this.props.cohort)
    axios
    .post("/api/getCohort", { date: this.state.currentDate, cohort: this.props.cohort })
    .then(res => {
      console.log(res);
      this.setState({
        cohortData: res.data
      });
    });
  }
  render() {
      console.log(this.props.cohort)
    const cohortDataTable = this.state.cohortData.map((cohort, index) => {
      let date = moment(cohort.date);
      let formattedDate = `${date.format("dddd")}, ${date.format(
        "MM-DD-YYYY"
      )}`;
      let firstPing = moment(cohort.first_ping, "HH:mm:ss").format("h:mm A");
      let lastPing = moment(cohort.last_ping, "HH:mm:ss").format("h:mm A");
      return (
        <>
          <tr className="table-rows">
            <td className="table-data">
              <Link className="student-link" to={`/student/${cohort.user_id}`}>
                <span>{cohort.first_name} {cohort.last_name}</span>
              </Link>
            </td>

            <td className="table-data">{formattedDate}</td>
            {cohort.first_ping === null ? (
              <td
                className="table-data"
                style={{ color: "#2aabe2", textAlign: "center" }}
              >
                Student Has Not Yet Arrived
              </td>
            ) : (
              <td className="table-data">{firstPing}</td>
            )}

            {cohort.last_ping === null ? (
              <td
                className="table-data"
                style={{ color: "#2aabe2", textAlign: "center" }}
              >
                Student Has Not Yet Left
              </td>
            ) : (
              <td className="table-data">{lastPing}</td>
            )}
          </tr>
        </>
      );
    });
    return (
      <>
          <table className="cohort-table">
            <tr className="table-rows">
              <th className='table-header'>
                <span>Name</span>
              </th>
              <th>
                <span>Date</span>
              </th>
              <th>
                <span>Time In</span>
              </th>
              <th>
                <span>Time Out</span>
              </th>
            </tr>
            {cohortDataTable}
          </table>
      </>
    );
  }
}