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
    host: 'localhost',
    database: 'grade'
})

router.use(auth)
    .route(api + '/grades/:number')
    .get(getGradeByNumber)

function getGradeByNumber(req, res) {
    console.log("Fetching all grades with number:", + req.params.number)
    const connection = getConnection()
    const queryString = "SELECT * FROM grade WHERE stuno = ?"
    const stuno = req.params.number
    
    connection.query(queryString, [stuno], (err, rows, fields) => {
        if (err) {
            console.log("fail to query for all grades")
            res.sendStatus(500)
            return
        }

        if (rows.length === 0) {
            console.log("empty result")
            res.status(404).send({error: "Param error"})
            return
        }

        console.log("fetch all grades successfully")

        res.json(rows)
    })
}

function getConnection() {
    return pool
}

module.exports = router

