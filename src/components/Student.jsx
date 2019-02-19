import React, { Component } from "react";
import Nav from "./Nav";
import "./../styles/Student.css";
import axios from "axios";
import moment from "moment";
import { withRouter } from "react-router-dom";

class Student extends Component {
  state = {
    studentInfo: [ ],
    first_name: '',
    last_name: '',
    sortBy: 'date desc'
  };

  componentDidMount() {
    axios.get(`/api/getStudent/${this.props.match.params.id}`).then(res => {
      this.setState({
        studentInfo: res.data,
        first_name: res.data[0].first_name,
        last_name: res.data[0].last_name
      });
    });
  }
  handleSort = (sortBy) => () => {
    this.setState({sortBy})
  }

  render() {
    const { first_name, last_name, studentInfo, sortBy } = this.state;

    let sortedStudentInfo = studentInfo.slice()

    if (sortBy === "time in asc") {
      sortedStudentInfo.sort((a, b) => {
        if ( 
          moment(a.first_ping, "h:mm A").isBefore(
            moment(b.first_ping, "h:mm A"))
          ) {
          return -1;
        } else {
          return 1;
        }
      })

    }else if(sortBy === 'time in desc'){
      sortedStudentInfo.sort((a, b) => {
        if ( 
          moment(a.first_ping, "h:mm A").isBefore(
            moment(b.first_ping, "h:mm A")) || !b.first_ping 
          ) {
          return 1;
        } else {
          return -1;
        }
      })
    
    } else if (sortBy === "date desc") {
      sortedStudentInfo = studentInfo.slice() //DB info is already in this order, so no need to sort.
    }else if(sortBy === 'date asc'){
      sortedStudentInfo = studentInfo.slice().reverse() //only need to reverse order from what DB sends.
    } else if (sortBy === "time out asc") {
      sortedStudentInfo.sort((a, b) => {
        if (
          moment(a.last_ping, "h:mm A").isBefore(moment(b.last_ping, "h:mm A"))
          || !a.last_ping
        ) {
          return -1;
        } else {
          return 1;
        }
      });
    } else if (sortBy === "time out desc") {
      sortedStudentInfo.sort((a, b) => {
        if (
          moment(a.last_ping, "h:mm A").isBefore(moment(b.last_ping, "h:mm A"))
          || !a.last_ping
        ) {
          return 1;
        } else {
          return -1;
        }
      });
    }

    const studentTable = sortedStudentInfo.map((student, i) => {
      let date = moment(student.date);
      let formattedDate = `${date.format("dddd")}, ${date.format(
        "MM-DD-YYYY"
      )}`;
      let firstPing = moment(student.first_ping, "HH:mm:ss").format("h:mm A");
      let lastPing = moment(student.last_ping, "HH:mm:ss").format("h:mm A");
      if(!student.first_ping && moment(student.date).format('ddd') === 'Sat'){
        return null;
      }else{
        return (
          <>
            <tr key={student.user_id}>
              <td>{formattedDate}</td>
              {student.first_ping === null ? (
                <td style={{ color: "#2aabe2", textAlign: "center" }}>
                  No Data Available For This Day
                </td>
              ) : (
                <td>
                  <span
                    className={
                      moment(firstPing, "h:mm A").isBefore(moment("9:10", "h:mm"))
                        ? "first-ping-green"
                        : "first-ping-red"
                    }
                  >
                    {firstPing}
                  </span>
                  <i class="edit far fa-edit" />
                </td>
              )}

              {student.last_ping === null ? (
                <td style={{ color: "#2aabe2", textAlign: "center" }}>
                  No Data Available For This Day
                </td>
              ) : (
                <td>
                  <span
                    className={
                      moment(lastPing, "h:mm A").isAfter(
                        moment("5:00 PM", "h:mm A")
                      )
                        ? "first-ping-green"
                        : "first-ping-red"
                    }
                  >
                    {lastPing}
                  </span>
                  <i class="edit far fa-edit" />
                </td>
              )}
            </tr>
          </>
        );
      }
    });
    return (
      
        <>
          <h1 className="attendance-header">
            Attendance For{" "}
            <span style={{ color: "#2aabe2" }}>
              {first_name} {last_name}
            </span>
          </h1>

          <table>
            <tr>
              <th>
                {sortBy === 'date desc' ?
                  <><span onClick={this.handleSort('date asc')}>Date </span><i class="fas fa-angle-down"></i></>
                :
                sortBy === 'date asc' ?
                  <><span onClick={this.handleSort('date desc')}>Date </span><i class="fas fa-angle-up"></i></>
                :
                  <span onClick={this.handleSort('date desc')}>Date </span>
                }
              </th>
              <th>
              {sortBy === 'time in desc' ?
                  <><span onClick={this.handleSort('time in asc')}>Time In </span><i class="fas fa-angle-down"></i></>
                :
                sortBy === 'time in asc' ?
                  <><span onClick={this.handleSort('time in desc')}>Time In </span><i class="fas fa-angle-up"></i></>
                :
                  <span onClick={this.handleSort('time in desc')}>Time In</span>
                }
              </th>
              <th>
              {sortBy === 'time out desc' ?
                  <><span onClick={this.handleSort('time out asc')}>Time Out </span><i class="fas fa-angle-down"></i></>
                :
                sortBy === 'time out asc' ?
                  <><span onClick={this.handleSort('time out desc')}>Time Out </span><i class="fas fa-angle-up"></i></>
                :
                  <span onClick={this.handleSort('time out asc')}>Time Out</span>
                }

              </th>
            </tr>
            {studentTable}
          </table>
          </>
          
      
    );
  }
}

export default withRouter(Student);
