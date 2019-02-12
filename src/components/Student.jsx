import React, { Component } from "react";
import Nav from "./Nav";
import "./../styles/Student.css";
import axios from "axios";

class Student extends Component {
  state = {
    studentInfo: []
  };

  componentDidMount() {
    axios.get(`/api/getStudent/${9771}`).then(res => {
      console.log(res.data);
    });
  }
  render() {
    return (
      <>
        <Nav>
          <h1 className="attendance-header">Attendance For Carter Childs</h1>
          <table>
            <tr>
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
            <tr>
              <td>02/01/19</td>
              <td>
                9:00 A.M.
                <i class="edit far fa-edit" />
              </td>
              <td>5:00 P.M.</td>
            </tr>
            <tr>
              <td>02/02/19</td>
              <td>
                9:00 A.M.
                <i class="edit far fa-edit" />
              </td>
              <td>5:00 P.M.</td>
            </tr>
            <tr>
              <td>02/02/19</td>
              <td>9:00 A.M.</td>
              <td>5:00 P.M.</td>
            </tr>
            <tr>
              <td>02/02/19</td>
              <td>9:00 A.M.</td>
              <td>5:00 P.M.</td>
            </tr>
            <tr>
              <td>02/02/19</td>
              <td>9:00 A.M.</td>
              <td>5:00 P.M.</td>
            </tr>
            <tr>
              <td>02/02/19</td>
              <td>9:00 A.M.</td>
              <td>5:00 P.M.</td>
            </tr>
          </table>
        </Nav>
      </>
    );
  }
}

export default Student;
