import React, { Component } from 'react';
import axios from 'axios'

class CohortSelector extends Component {
    state = { 
        cohorts: [],
        selectedCohort: '',
        location: '' 
    }

    componentDidMount(){
        axios.get('/api/getAllCohorts').then(res => {
            this.setState({cohorts: res.data})
        })
    }
    updateSelectedCohort = () => (e) => {
        this.setState({selectedCohort: e.target.value})
    }
    updateLocation = () => (e) => {
        this.setState({location: e.target.value})
    }
    render() { 
        const {cohorts, selectedCohort, location} = this.state
        console.log(location)
        let filteredCohorts = cohorts
        if(location){
            filteredCohorts = cohorts.slice().filter(cohort => cohort.location === location)
        }
        const cohortSelectors = filteredCohorts.map(cohort => {
            return <option key={cohort.cohort} value={cohort.cohort}>{cohort.cohort}</option>
        })
        return ( 
            <div>
                <select value={location} onChange={this.updateLocation()}>
                    <option default value=''>All Locations</option>
                    <option value='Dallas'>Dallas</option>
                    <option value='Lehi'>Lehi</option>
                    <option value='PHX'>Pheonix</option>
                    <option value='Provo'>Provo</option>
                </select>
                <select value={selectedCohort} onChange={this.updateSelectedCohort()}>
                    <option value=''>Choose a Cohort</option>
                    {cohortSelectors}
                </select>
            </div> 
        );
    }
}
 
export default CohortSelector;