import React, { Component } from "react";
import "./../styles/Dashboard.css";
import Nav from "./Nav";
import moment from "moment";
import axios from "axios";
import "rc-time-picker/assets/index.css";
import { Link } from "react-router-dom";
import TimePicker from "rc-time-picker";
class CohortView extends Component {
  state = {
    cohort: this.props.cohort,
    // currentDate: moment().format('MM-DD-YYYY'),
    currentDate: moment(this.props.date, "YYYY-MM-DD").format("MM-DD-YYYY"),
    cohortData: [],
    sortBy: "time in desc",
    slotsToEdit: [],
    time_in: moment("9:00 AM", "h:mm a"),
    time_out: moment("5:00 PM", "h:mm a"),
    comment: "",
    checkAll: false
  };

  componentDidMount() {
    console.log(this.props);
    this.getCohortData();
  }//
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

  handleTimeChange = key => e => {
    console.log(e);
    this.setState({
      [key]: e
    });
  };

  handleCommentChange = key => e => {
    this.setState({
      [key]: e.target.value
    });
  };

  handleSortBy = sortBy => {
    this.setState({ sortBy });
  };

  handleSlotsToEdit = selectedStudent => {
    const slotsToEdit = [...this.state.slotsToEdit];
    const foundIndex = slotsToEdit.findIndex(attendance_id => {
      return attendance_id === selectedStudent;
    });
    if (foundIndex !== -1) {
      slotsToEdit.splice(foundIndex, 1);
    } else {
      slotsToEdit.push(selectedStudent);
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
      this.getCohortData();
    });
    this.props.toggleEditModal();
  };
  checkAll = () => {
    const { cohortData, checkAll } = this.state;
    if (checkAll) {
      this.setState({ checkAll: false, slotsToEdit: [] });
      this.props.updateEditButtonDisplay(false);
    } else {
      let newSlotArr = [];
      cohortData.forEach(slot => {
        newSlotArr.push(slot.attendance_id);
        this.props.updateEditButtonDisplay(true);
      });

      this.setState({ checkAll: true, slotsToEdit: newSlotArr });
    }
  };

  render() {
    console.log(this.state);
    const { classes, date } = this.props;
    const {
      cohortData,
      sortBy,
      slotsToEdit,
      time_in,
      time_out,
      comment,
      checkAll
    } = this.state;
    let sortedCohortData = cohortData.slice();
    if (sortBy === "time in asc") {
      sortedCohortData.sort((a, b) => {
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
      sortedCohortData = cohortData.slice();
    } else if (sortBy === "name asc") {
      sortedCohortData.sort((a, b) => {
        if (b.last_name.toLowerCase() < a.last_name.toLowerCase()) {
          return 1;
        } else {
          return -1;
        }
      });
    } else if (sortBy === "name desc") {
      sortedCohortData.sort((a, b) => {
        if (b.last_name.toLowerCase() > a.last_name.toLowerCase()) {
          return 1;
        } else {
          return -1;
        }
      });
    } else if (sortBy === "time out asc") {
      sortedCohortData.sort((a, b) => {
        if (
          moment(a.last_ping, "h:mm A").isBefore(moment(b.last_ping, "h:mm A"))
        ) {
          return -1;
        } else {
          return 1;
        }
      });
    } else if (sortBy === "time out desc") {
      sortedCohortData.sort((a, b) => {
        if (
          moment(a.last_ping, "h:mm A").isBefore(moment(b.last_ping, "h:mm A"))
        ) {
          return 1;
        } else {
          return -1;
        }
      });
    }

    let dayOfWeek = moment(date).format("ddd");
    const cohortDataTable = sortedCohortData.map((student, index) => {
      let firstPing = moment(student.first_ping, "HH:mm:ss").format("h:mm A");
      let lastPing = moment(student.last_ping, "HH:mm:ss").format("h:mm A");

      let selectedDay = moment(student.date).format("MM/DD/YYYY");
      let today = moment().format("MM/DD/YYYY");
      // let today = '08/30/2018'
      let currentTime = moment().format("h:mm A");
      // let currentTime = '3:30 PM'

      let dayStart = "9:01 AM"; //9:01 or later will be marked red instead of green
      let dayEnd = "4:50 PM";
      if (
        selectedDay === today &&
        moment(currentTime, "h:mm A").isBefore(moment(dayEnd, "h:mm A"))
      ) {
        dayEnd = moment(currentTime, "h:mm A")
          .subtract(10, "minutes")
          .format("h:mm A");
      }
      // if(dayOfWeek === 'Fri'){
      //   dayStart = '9:36 AM'
      // }

      return (
        <>
          <tr className="table-rows">
            <td className="table-data-check">
              <input
                type="checkbox"
                checked={
                  this.state.slotsToEdit.indexOf(student.attendance_id) !== -1
                }
                onChange={() => this.handleSlotsToEdit(student.attendance_id)}
              />
            </td>
            <td className="table-data-name">
              <Link className="student-link" to={`/student/${student.user_id}`}>
                <span>
                  {student.first_name} {student.last_name}
                </span>
              </Link>
            </td>

            {student.first_ping === null ? (
              <td style={{ color: "#2aabe2", textAlign: "center" }}>
                Student Has Not Yet Arrived
              </td>
            ) : (
              <td
                className={
                  moment(firstPing, "h:mm A").isBefore(
                    moment(dayStart, "h:mm A")
                  )
                    ? "first-ping-green"
                    : "first-ping-red"
                }
              >
                {firstPing}
              </td>
            )}

            {student.last_ping === null ? (
              <td style={{ color: "#2aabe2", textAlign: "center" }}>
                Student Has Not Yet Arrived
              </td>
            ) : (
              <td
                className={
                  moment(lastPing, "h:mm A").isAfter(moment(dayEnd, "h:mm A"))
                    ? "first-ping-green"
                    : "first-ping-red"
                }
              >
                {lastPing}
              </td>
            )}
            <td className="table-data-comments">{student.comment}</td>
          </tr>
        </>
      );
    });
    //
    return (
      <>
        <table className="cohort-table">
          <tr className="table-rows">
            <th className="table-header-cohort">
              <input
                value={this.state.checkAll}
                onChange={this.checkAll}
                type="checkbox"
              />
            </th>
            <th className="table-header-cohort">
              {sortBy === "name asc" ? (
                <>
                  <span
                    className="column-title"
                    onClick={() => this.handleSortBy("name desc")}
                  >
                    Name{" "}
                  </span>
                  <i class="fas fa-angle-up" />
                </>
              ) : sortBy === "name desc" ? (
                <>
                  <span
                    className="column-title"
                    onClick={() => this.handleSortBy("name asc")}
                  >
                    Name{" "}
                  </span>
                  <i class="fas fa-angle-down" />
                </>
              ) : (
                <span
                  className="column-title"
                  onClick={() => this.handleSortBy("name asc")}
                >
                  Name{" "}
                </span>
              )}
            </th>
            <th className="table-header-cohort">
              {sortBy === "time in asc" ? (
                <>
                  <span
                    className="column-title"
                    onClick={() => this.handleSortBy("time in desc")}
                  >
                    Time In{" "}
                  </span>
                  <i class="fas fa-angle-up" />
                </>
              ) : sortBy === "time in desc" ? (
                <>
                  <span
                    className="column-title"
                    onClick={() => this.handleSortBy("time in asc")}
                  >
                    Time In{" "}
                  </span>
                  <i class="fas fa-angle-down" />
                </>
              ) : (
                <span
                  className="column-title"
                  onClick={() => this.handleSortBy("time in desc")}
                >
                  Time In{" "}
                </span>
              )}
            </th>
            <th className="table-header-cohort">
              {sortBy === "time out asc" ? (
                <>
                  <span
                    className="column-title"
                    onClick={() => this.handleSortBy("time out desc")}
                  >
                    Time Out{" "}
                  </span>
                  <i class="fas fa-angle-up" />
                </>
              ) : sortBy === "time out desc" ? (
                <>
                  <span
                    className="column-title"
                    onClick={() => this.handleSortBy("time out asc")}
                  >
                    Time Out{" "}
                  </span>
                  <i class="fas fa-angle-down" />
                </>
              ) : (
                <span
                  className="column-title"
                  onClick={() => this.handleSortBy("time out asc")}
                >
                  Time Out{" "}
                </span>
              )}
            </th>
            <th className="table-header-cohort">
              <span>Comments</span>
            </th>
          </tr>
          {cohortDataTable}
        </table>
        {this.props.editToggle && (
          <div
            className="edit-modal-wrapper"
            onClick={() => this.props.toggleEditModal()}
          >
            <div className="edit-modal" onClick={e => e.stopPropagation()}>
              <h1 style={{ color: "#2aabe2", position: "relative", top: "5%" }}>
                Select A Time
              </h1>

              <TimePicker
                showSecond={false}
                onChange={this.handleTimeChange("time_in")}
                use12Hours
              />

              <TimePicker
                showSecond={false}
                onChange={this.handleTimeChange("time_out")}
                value={this.state.time_out}
                use12Hours
              />
              <textarea
                className="edit-input"
                placeholder="Comment"
                onChange={this.handleCommentChange("comment")}
                type="text"
              />
              <button className="save-edit" onClick={this.saveEdit}>
                Save Edit
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
}
export default CohortView;
