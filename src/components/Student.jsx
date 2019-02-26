import React, { Component } from "react";
import Nav from "./Nav";
import "./../styles/Student.css";
import axios from "axios";
import moment from "moment";
import TimePicker from "rc-time-picker";
import { withRouter } from "react-router-dom";

class Student extends Component {
  state = {
    studentInfo: [],
    first_name: "",
    last_name: "",
    sortBy: "date desc",
    slotsToEdit: [],
    checkAll: false,
    time_in: "",
    time_out: "",
    comment: ""
  };

  componentDidMount() {
    this.getStudentData();
  }

  getStudentData = () => {
    axios.get(`/api/getStudent/${this.props.match.params.id}`).then(res => {
      this.setState({
        studentInfo: res.data,
        first_name: res.data[0].first_name,
        last_name: res.data[0].last_name
      });
    });
  };

  handleChange = key => e => {
    this.setState({
      [key]: e.target.value
    });
  };
  handleSort = sortBy => () => {
    this.setState({ sortBy });
  };

  handleSlotsToEdit = selectedSlot => {
    const slotsToEdit = [...this.state.slotsToEdit];
    const foundIndex = slotsToEdit.findIndex(attendance_id => {
      return attendance_id === selectedSlot;
    });
    if (foundIndex !== -1) {
      slotsToEdit.splice(foundIndex, 1);
    } else {
      slotsToEdit.push(selectedSlot);
    }
    if (slotsToEdit[0]) {
      this.props.updateEditButtonDisplay(true);
    } else {
      this.props.updateEditButtonDisplay(false);
    }
    this.setState({ slotsToEdit });
  };
  saveEdit = () => {
    const { slotsToEdit, time_in, time_out, comment } = this.state;
    const promiseArr = [];
    for (let i = 0, length = slotsToEdit.length; i < length; i++) {
      let promise = axios.put("/api/edit", {
        attendance_id: slotsToEdit[i],
        time_in,
        time_out,
        comment
      });
      promiseArr.push(promise);
    }
    Promise.all(promiseArr).then(() => {
      this.getStudentData();
    });
  };
  checkAll = () => {
    const { studentInfo, checkAll } = this.state;
    if (checkAll) {
      this.setState({ checkAll: false, slotsToEdit: [] });
      this.props.updateEditButtonDisplay(false);
    } else {
      let newSlotArr = [];
      studentInfo.forEach(slot => {
        newSlotArr.push(slot.attendance_id);
        this.props.updateEditButtonDisplay(true);
      });

      this.setState({ checkAll: true, slotsToEdit: newSlotArr });
    }
  };

  render() {
    const {
      first_name,
      last_name,
      studentInfo,
      sortBy,
      slotsToEdit
    } = this.state;
    console.log(slotsToEdit);
    let sortedStudentInfo = studentInfo.slice();

    if (sortBy === "time in asc") {
      sortedStudentInfo.sort((a, b) => {
        if (
          moment(a.first_ping, "h:mm A").isBefore(
            moment(b.first_ping, "h:mm A")
          )
        ) {
          return -1;
        } else {
          return 1;
        }
      });
    } else if (sortBy === "time in desc") {
      sortedStudentInfo.sort((a, b) => {
        if (
          moment(a.first_ping, "h:mm A").isBefore(
            moment(b.first_ping, "h:mm A")
          ) ||
          !b.first_ping
        ) {
          return 1;
        } else {
          return -1;
        }
      });
    } else if (sortBy === "date desc") {
      sortedStudentInfo = studentInfo.slice(); //DB info is already in this order, so no need to sort.
    } else if (sortBy === "date asc") {
      sortedStudentInfo = studentInfo.slice().reverse(); //only need to reverse order from what DB sends.
    } else if (sortBy === "time out asc") {
      sortedStudentInfo.sort((a, b) => {
        if (
          moment(a.last_ping, "h:mm A").isBefore(
            moment(b.last_ping, "h:mm A")
          ) ||
          !a.last_ping
        ) {
          return -1;
        } else {
          return 1;
        }
      });
    } else if (sortBy === "time out desc") {
      sortedStudentInfo.sort((a, b) => {
        if (
          moment(a.last_ping, "h:mm A").isBefore(
            moment(b.last_ping, "h:mm A")
          ) ||
          !a.last_ping
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
      if (!student.first_ping && moment(student.date).format("ddd") === "Sat") {
        return null;
      } else {
        return (
          <>
            <tr key={student.user_id}>
              <td className="table-data-check">
                <input
                  type="checkbox"
                  checked={
                    this.state.slotsToEdit.indexOf(student.attendance_id) !== -1
                  }
                  onChange={() => this.handleSlotsToEdit(student.attendance_id)}
                />
              </td>

              <td>{formattedDate}</td>
              {student.first_ping === null ? (
                <td style={{ color: "#2aabe2", textAlign: "center" }}>
                  No Data Available For This Day
                </td>
              ) : (
                <td>
                  <span
                    className={
                      moment(firstPing, "h:mm A").isBefore(
                        moment("9:10", "h:mm")
                      )
                        ? "first-ping-green"
                        : "first-ping-red"
                    }
                  >
                    {firstPing}
                  </span>
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
                </td>
              )}
              <td className='table-data-comments'>
                <span>{student.comment}</span>
              </td>
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
              <input
                value={this.state.checkAll}
                onChange={this.checkAll}
                type="checkbox"
              />
            </th>

            <th>
              {sortBy === "date desc" ? (
                <>
                  <span onClick={this.handleSort("date asc")}>Date </span>
                  <i class="fas fa-angle-down" />
                </>
              ) : sortBy === "date asc" ? (
                <>
                  <span onClick={this.handleSort("date desc")}>Date </span>
                  <i class="fas fa-angle-up" />
                </>
              ) : (
                <span onClick={this.handleSort("date desc")}>Date </span>
              )}
            </th>
            <th>
              {sortBy === "time in desc" ? (
                <>
                  <span onClick={this.handleSort("time in asc")}>Time In </span>
                  <i class="fas fa-angle-down" />
                </>
              ) : sortBy === "time in asc" ? (
                <>
                  <span onClick={this.handleSort("time in desc")}>
                    Time In{" "}
                  </span>
                  <i class="fas fa-angle-up" />
                </>
              ) : (
                <span onClick={this.handleSort("time in desc")}>Time In</span>
              )}
            </th>
            <th>
              {sortBy === "time out desc" ? (
                <>
                  <span onClick={this.handleSort("time out asc")}>
                    Time Out{" "}
                  </span>
                  <i class="fas fa-angle-down" />
                </>
              ) : sortBy === "time out asc" ? (
                <>
                  <span onClick={this.handleSort("time out desc")}>
                    Time Out{" "}
                  </span>
                  <i class="fas fa-angle-up" />
                </>
              ) : (
                <span onClick={this.handleSort("time out asc")}>Time Out</span>
              )}
            </th>
            <th className="table-header-cohort">
              <span>Comments</span>
            </th>
          </tr>
          {studentTable}
        </table>
        {this.props.editToggle && (
          <div className="edit-modal-wrapper" onClick={() => this.props.toggleEditModal()}>
            <div className="edit-modal" onClick={e => e.stopPropagation()}>
              <h1 style={{ color: "#2aabe2", position: 'relative', top: '5%' }}>Select A Time</h1>
              
              <TimePicker
                showSecond={false}
                defaultValue={moment("9:00 AM", "h:mm a")}
                use12Hours
              />

              <TimePicker
                showSecond={false}
                defaultValue={moment("5:00 PM", "h:mm a")}
                use12Hours
              />
              <textarea
                className="edit-input"
                placeholder="Comment"
                onChange={this.handleChange("comment")}
                value={this.state.comment}
                type="text"
              />
              <button className='save-edit' onClick={this.saveEdit}>Save Edit</button>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default withRouter(Student);
