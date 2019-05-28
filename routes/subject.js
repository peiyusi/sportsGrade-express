const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const config = require('../config.js')
const api = config.NETWORK.API_ROUTE
const auth = require('../middlewares/authorization.js')

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'abc',
    database: 'grade',
    host: 'localhost'
})

router.use(auth)
    .route(api + '/subject')
    .get(getSubjectGradeByNum)

function getSubjectGradeByNum(req, res) {
    const connection = getConnection()
    const queryString = "SELECT * FROM grade WHERE stuno = ? AND type = ?"
    const stuno = req.query.stuno
    const subject = req.query.subject
    
    if (stuno === undefined || subject === undefined) {
        console.log("Missing param")
        res.status(422).send({error: "Missing param"})
        return
    } 

    console.log("Fetching " + subject  + " with number:" + stuno)

    connection.query(queryString, [stuno, subject], (err, rows, fields) => {
        if (err) {
            console.log("fail to query for grades")
            res.sendstatus(500)
            return
        }

        if (rows.length === 0) {
            console.log("empty result")
            res.status(404).send({error: "Param error"})
            return
        }

        console.log("fetch grade successfully")

        res.json(rows)
    })
}

function getConnection() {
    return pool
}
module.exports = router
