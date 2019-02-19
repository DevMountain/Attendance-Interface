import React, { Component } from "react";
import Nav from "./Nav";
import "./../styles/Student.css";
import axios from "axios";
import moment from "moment";
import TimePicker from 'rc-time-picker';
import { withRouter } from "react-router-dom";

class Student extends Component {
  state = {
    studentInfo: [
      {
        first_name: "",
        last_name: ""
      }
    ],
  };

  componentDidMount() {
    axios.get(`/api/getStudent/${this.props.match.params.id}`).then(res => {
      this.setState({
        studentInfo: res.data
      });
    });
  }

  render() {
    const { first_name, last_name } = this.state.studentInfo[0];
    const studentTable = this.state.studentInfo.map((student, i) => {
      let date = moment(student.date);
      let formattedDate = `${date.format("dddd")}, ${date.format(
        "MM-DD-YYYY"
      )}`;
      let firstPing = moment(student.first_ping, "HH:mm:ss").format("h:mm A");
      let lastPing = moment(student.last_ping, "HH:mm:ss").format("h:mm A");

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
                <i  class="edit far fa-edit" />
                />
              </td>
            )}
          </tr>
        </>
      );
    });
    return (
      <>
        <Nav>
          <h1 className="attendance-header">
            Attendance For{" "}
            <span style={{ color: "#2aabe2" }}>
              {first_name} {last_name}
            </span>
          </h1>

          <table>
            <tr>
              <th className='table-header'>
                <span>Date</span><br/>

              </th>
              <th className='table-header'>
                <span>Time In</span>
              </th>
              <th className='table-header'>
                <span>Time Out</span>
              </th>
            </tr>
            {studentTable}
          </table>
        </Nav>
      </>
    );
  }
}

export default withRouter(Student);
