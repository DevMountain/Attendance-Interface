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
    }
}