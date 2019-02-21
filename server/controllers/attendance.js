module.exports = {
    getStudent: (req, res) => {
        const db = req.app.get('db')

        db.get_single_student([req.params.id]).then((response) => {
            res.status(200).send(response)
        })


    },
    getAllCohorts: async (req, res) => {
        const db = req.app.get('db')

        const cohorts = await db.get_all_cohorts()
            
        res.status(200).send(cohorts)
        
    },
    getCohortAttendance: (req, res) => {
        const db = req.app.get('db')
        const {
            cohort,
            date
        } = req.body
        db.get_cohort_attendance([cohort, date]).then((response) => {
            res.status(200).send(response)
        })
    },
    editAttendance: async (req, res) => {
        try{
            const db = req.app.get('db')
            const {
                attendance_id,
                time_in,
                time_out, 
                comment
            } = req.body
            console.log(req.body)
            const [attendance] = await db.get_single_attendance({attendance_id})
            console.log(attendance)
            let updatedAttendance = {
                attendance_id,
                time_in: time_in || attendance.first_ping,
                time_out: time_out || attendance.last_ping,
                comment: comment || attendance.comment
            }
            console.log(updatedAttendance)
            const updated = await db.edit_attendance(updatedAttendance)
            res.status(200).send({message: 'time updated'})
        }catch(error){
            console.log(error)
            res.status(501).send(error)
        }
    }
}