import React from 'react';
import Student from './Student'
import Nav from './Nav'

const StudentDashboard = () => {
    return (
        <>
        <Nav
          render={(toggleEditModal, editToggle, updateEditButtonDisplay) => <Student toggleEditModal={toggleEditModal} editToggle={editToggle} updateEditButtonDisplay={updateEditButtonDisplay}/>}
        />
        </>
    )
}

export default StudentDashboard