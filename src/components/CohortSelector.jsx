import React from 'react';
import './../styles/Nav.css'
const CohortSelector =(props) => {
  
        const {cohorts, selectedCohort, location, updateLocation, updateSelectedCohort} = props
        let filteredCohorts = cohorts
        if(location){
            filteredCohorts = cohorts.filter(cohort => cohort.location === location)
        }
        const cohortSelectors = filteredCohorts.map(cohort => {
            return <option key={cohort.cohort} value={cohort.cohort}>{cohort.cohort}</option>
        })
        return ( 
            <div className='inner-container-select'>
                <select className='location-select' value={location} onChange={updateLocation()}>
                    <option default value=''>Choose a Location</option>
                    <option value='Dallas'>Dallas</option>
                    <option value='Lehi'>Lehi</option>
                    <option value='PHX'>Phoenix</option>
                    <option value='Provo'>Provo</option>
                </select>
                <select className='cohort-select'value={selectedCohort} onChange={updateSelectedCohort()}>
                    <option value=''>Choose a Cohort</option>
                    {cohortSelectors}
                </select>
            </div> 
        );
    }
 
export default CohortSelector;