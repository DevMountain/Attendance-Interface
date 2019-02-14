import React, { Component } from "react";
import "./../styles/Dashboard.css";
import Nav from "./Nav";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";



const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: '5rem',
    marginRight: '5rem',
    width: 150,
  }
});


 class CohortView extends Component {
  state = {
    cohort: this.props.cohort,
    // currentDate: moment().format('MM-DD-YYYY'),
    currentDate: moment(this.props.date, 'YYYY-MM-DD').format('MM-DD-YYYY'),
    cohortData: [],
    sortBy: 'time in desc'
  };

  componentDidMount() {
    this.getCohortData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.cohort !== this.props.cohort) this.getCohortData();
    if (prevProps.date !== this.props.date) this.getCohortData();

    
  }
  getCohortData = () => {
    console.log(this.props.cohort);
    axios
      .post("/api/getCohort", {
        date: this.props.date,
        cohort: this.props.cohort
      })
      .then(res => {
        console.log(res);
        this.setState({
          cohortData: res.data
        });
      });
  };

  handleSortBy = (sortBy) => {
    this.setState({sortBy})
  }
  render() {
    const { classes, date } = this.props;
    const { cohortData, sortBy } = this.state
    console.log(date,cohortData)
    let sortedCohortData = cohortData.slice()
    if(sortBy === 'time in asc'){
     sortedCohortData.sort((a, b) => {
        if(moment(a.first_ping, 'h:mm A').isBefore(moment(b.first_ping, 'h:mm A'))){
          return -1
          console.log(b - a)
        }else{
          return 1
        }
      })
    }else if(sortBy === 'time in desc'){
      sortedCohortData = cohortData.slice()
    }else if(sortBy === 'name asc'){
      sortedCohortData.sort((a, b) => {
        if( b.last_name.toLowerCase() < a.last_name.toLowerCase() ){
          return 1
        }else {
          return -1
        }
      })
    }else if(sortBy === 'name desc'){
      sortedCohortData.sort((a, b) => {
        if( b.last_name.toLowerCase() > a.last_name.toLowerCase() ){
          return 1
        }else {
          return -1
        }
      })
    }else if(sortBy === 'time out asc'){
      sortedCohortData.sort((a, b) => {
        if(moment(a.last_ping, 'h:mm A').isBefore(moment(b.last_ping, 'h:mm A'))){
          return -1
        }else{
          return 1
        }
      })
    }else if(sortBy === 'time out desc'){
      sortedCohortData.sort((a, b) => {
        if(moment(a.last_ping, 'h:mm A').isBefore(moment(b.last_ping, 'h:mm A'))){
          return 1
        }else{
          return -1
        }
      })
    }





    let currentDate = moment().format('YYYY-MM-DD')
    const cohortDataTable = sortedCohortData.map((cohort, index) => {
      let date = moment(cohort.date);
      let formattedDate = `${date.format("dddd")}, ${date.format(
        "MM-DD-YYYY"
      )}`;
      let firstPing = moment(cohort.first_ping, "HH:mm:ss").format("h:mm A");
      let lastPing = moment(cohort.last_ping, "HH:mm:ss").format("h:mm A");
      let test = moment(firstPing, "h:mm A").isBefore(moment("9:05", "h:mm"));
      return (
        <>
          <tr className="table-rows">
            <td className="table-data-name">
              <Link className="student-link" to={`/student/${cohort.user_id}`}>
                <span>
                  {cohort.first_name} {cohort.last_name}
                </span>
              </Link>
            </td>

            {cohort.first_ping === null ? (
              <td
              style={{ color: "#2aabe2", textAlign: "center" }}
              >
                Student Has Not Yet Arrived
              </td>
            ) : (
              <td
              className={
                moment(firstPing, "h:mm A").isBefore(moment("9:10", "h:mm"))
                ? "first-ping-green"
                : "first-ping-red"
              }
              >
                {firstPing}
              </td>
            )}

            {cohort.last_ping === null ? (
              <td
                style={{ color: "#2aabe2", textAlign: "center" }}
                >
                Student Has Not Yet Arrived
              </td>
            ) : (
              <td
              className={
                moment(lastPing, "h:mm A").isAfter(
                  moment("5:00 PM", "h:mm A")
                  )
                  ? "first-ping-green"
                  : "first-ping-red"
                }
                >
                {lastPing}
              </td>
            )}
            <td className="table-data-comments">lalaskdjf;alskdjf</td>
          </tr>
        </>
      );
    });
    return (
      <>
        <table className="cohort-table">
          <tr className="table-rows">
            <th className="table-header">
              
              {sortBy === 'name asc' ?
              (
                <><span onClick={() => this.handleSortBy('name desc')}>Name </span><i class="fas fa-angle-up"></i></>
              )
              :
              sortBy === 'name desc' ? 
              (
                <><span onClick={() => this.handleSortBy('name asc')}>Name </span><i class="fas fa-angle-down"></i></>
              )
              :
                <span onClick={() => this.handleSortBy('name asc')}>Name </span>
              }

            </th>
            <th>
            {sortBy === 'time in asc' ?
                <><span onClick={() => this.handleSortBy('time in desc')}>Time In </span><i class="fas fa-angle-up"></i></>
              :
              sortBy === 'time in desc' ?
                <><span onClick={() => this.handleSortBy('time in asc')}>Time In </span><i class="fas fa-angle-down"></i></>
              :
                <span onClick={() => this.handleSortBy('time in desc')}>Time In </span>
            }
            </th>
            <th>
            {sortBy === 'time out asc' ?
                <><span onClick={() => this.handleSortBy('time out desc')}>Time Out </span><i class="fas fa-angle-up"></i></>
              :
              sortBy === 'time out desc' ?
                <><span onClick={() => this.handleSortBy('time out asc')}>Time Out </span><i class="fas fa-angle-down"></i></>
              :
                <span onClick={() => this.handleSortBy('time out desc')}>Time Out </span>
            }
            </th>
            <th>
              <span>Comments</span>
            </th>
          </tr>
          {cohortDataTable}
        </table>
      </>
    );
  }
}
export default (CohortView)



