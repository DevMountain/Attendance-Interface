module.exports = {
    getStudent: (req, res) => {
        const db = req.app.get('db')

        db.get_single_student([req.params.id]).then((response) => {
            res.status(200).send(response)
        })


    }
}