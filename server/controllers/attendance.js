module.exports = {
    getStudent: (req, res) => {
        const db = req.app.get('db')

        db.get_single_student([req.params.id]).then((response) => {
            res.status(200).send(response)
        })


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
    }
}