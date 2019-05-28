// load app server using express
const express = require('express')
const app = express()
// using morgan for request logs
const morgan = require('morgan')
const random = require('string-random')
const jwt = require('jsonwebtoken')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/swagger.yaml') 
//routers
const studentRouter = require('./routes/student.js')
const gradeRouter = require('./routes/grade.js')
const subjectRouter = require('./routes/subject.js')
//config
const config = require('./config.js')
const api = config.NETWORK.API_ROUTE

app.listen(config.NETWORK.PORT, () => {
    console.log("Server is up and listening to " + config.NETWORK.PORT + "...")
})
//using swagger-ui-express for api visulization
app.use(api + "/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('short'))

app.get(api, (req, res) => {
    res.sendStatus(403)
})

app.get(api + "/authorization", (req, res) => {
    const user = {username: random()}
    const mtoken = jwt.sign(user, config.JWT_SECRET, {expiresIn: 60*60})
    res.status(200).send({msg: "Successful generate token", token: mtoken}) 
})

app.use(studentRouter)
app.use(gradeRouter)
app.use(subjectRouter)



