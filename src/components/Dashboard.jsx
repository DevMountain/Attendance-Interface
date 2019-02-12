import React, { Component } from 'react';
import Nav from './Nav'
import CohortSelector from './CohortSelector';
export default class Dashboard extends Component {
  render() {
    return(
      <>
        <Nav>
          <CohortSelector />
        </Nav>
        
      </>
    );
  }
}
