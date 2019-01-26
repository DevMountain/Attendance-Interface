import React, { Component } from 'react';

export const UserContext = React.createContext();

export default class ContextProvider extends Component {
  state = {
    cohortId: 0,
    role: ''
  }

  setData = (data) => {
    this.setState(data)
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
