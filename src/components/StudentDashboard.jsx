import React from 'react';
import Student from './Student'
import Nav from './Nav'

const StudentDashboard = () => {
    return (
        <>
        <Nav
          render={(editToggle, updateEditButtonDisplay) => <Student editToggle={editToggle} updateEditButtonDisplay={updateEditButtonDisplay}/>}
        />
        </>
    )
}

export default StudentDashboard