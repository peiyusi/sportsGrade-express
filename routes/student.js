const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const config = require('../config.js')
const api = config.NETWORK.API_ROUTE
const auth = require('../middlewares/authorization.js')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'abc',
    database: 'grade'
})

router.use(auth)
    .route(api + '/student/:stuno')
    .get(getStudentByNum)

function getStudentByNum(req, res) {
    console.log("Fetching student with number:", + req.params.stuno)
    
    const connection = getConnection()
    const stuno = req.params.stuno

    if (stuno === undefined) {
        res.status(422).send({error: 'Missing param'})
        return
    }

    const queryString = "SELECT * FROM student WHERE stuno = ?"
    connection.query(queryString, [stuno], (err, rows, fields) => {
        if (err) {
            console.log("failed to query for users: " + err)
            res.status(500).end()
            return
        }

        if (rows.length === 0) {
            console.log("empty result")
            res.status(404).send({error: 'Param error'})
            return
        }

        console.log("fetch user successfully")

        res.json(rows);
    })
}


function getConnection() {
    return pool
}

module.exports = router
