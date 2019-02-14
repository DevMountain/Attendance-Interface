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





    let dayOfWeek = moment(date).format('ddd')
    console.log(dayOfWeek)
    const cohortDataTable = sortedCohortData.map((cohort, index) => {
      let firstPing = moment(cohort.first_ping, "HH:mm:ss").format("h:mm A");
      let lastPing = moment(cohort.last_ping, "HH:mm:ss").format("h:mm A");
      
      let selectedDay = moment(cohort.date).format('MM/DD/YYYY');
      let today = moment().format('MM/DD/YYYY')
      // let today = '08/30/2018'
      let currentTime = moment().format('h:mm A')
      // let currentTime = '3:30 PM'

      let dayStart = '9:01 AM' //9:01 or later will be marked red instead of green
      let dayEnd = '4:50 PM'
      if(selectedDay === today && moment(currentTime, 'h:mm A').isBefore(moment(dayEnd, 'h:mm A'))){
        dayEnd = moment(currentTime, 'h:mm A').subtract(10, 'minutes').format('h:mm A')
      }
      // if(dayOfWeek === 'Fri'){
      //   dayStart = '9:36 AM'
      // }

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
                moment(firstPing, "h:mm A").isBefore(moment(dayStart, 'h:mm A'))
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
                  moment(dayEnd, 'h:mm A')
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
                <><span className='column-title' onClick={() => this.handleSortBy('name desc')}>Name </span><i class="fas fa-angle-up"></i></>
              )
              :
              sortBy === 'name desc' ? 
              (
                <><span className='column-title' onClick={() => this.handleSortBy('name asc')}>Name </span><i class="fas fa-angle-down"></i></>
              )
              :
                <span className='column-title' onClick={() => this.handleSortBy('name asc')}>Name </span>
              }

            </th>
            <th>
            {sortBy === 'time in asc' ?
                <><span className='column-title' onClick={() => this.handleSortBy('time in desc')}>Time In </span><i class="fas fa-angle-up"></i></>
              :
              sortBy === 'time in desc' ?
                <><span className='column-title' onClick={() => this.handleSortBy('time in asc')}>Time In </span><i class="fas fa-angle-down"></i></>
              :
                <span className='column-title' onClick={() => this.handleSortBy('time in desc')}>Time In </span>
            }
            </th>
            <th>
            {sortBy === 'time out asc' ?
                <><span className='column-title' onClick={() => this.handleSortBy('time out desc')}>Time Out </span><i class="fas fa-angle-up"></i></>
              :
              sortBy === 'time out desc' ?
                <><span className='column-title' onClick={() => this.handleSortBy('time out asc')}>Time Out </span><i class="fas fa-angle-down"></i></>
              :
                <span className='column-title' onClick={() => this.handleSortBy('time out desc')}>Time Out </span>
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



