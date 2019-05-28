const jwt = require('jsonwebtoken')
const express = require('express')
const config = require('../config.js')

const SUPER_SECRET = config.JWT_SECRET
const app = express()

module.exports = function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[0]
        req.token = bearerToken
        jwt.verify(req.token, SUPER_SECRET, (err, authData) => {
            if (err) {
                console.log(err)
                res.status(403).send({error: "Invalid token"})
            } else {
                next()
            }
        })
    } else {
        console.log("Need bearHeader!")
        res.status(403).send({error: "Required token"})
    }
}
