import React from 'react';
import Student from './Student'
import Nav from './Nav'

const StudentDashboard = () => {
    return (
        <>
        <Nav
          render={() => <Student />}
        />
        </>
    )
}

export default StudentDashboard