import React, { Component } from 'react';

export const UserContext = React.createContext();

export default class ContextProvider extends Component {
  state = {
    cohortId: 0,
    role: ''
  }

  setData = (data, cb = () => { }) => {
    this.setState(data, cb)
  }

  render() {
    return (
      <UserContext.Provider value={{
        state: this.state,
        actions: {
          setData: this.setData
        }
      }}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}
