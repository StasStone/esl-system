const express = require('express')
const cors = require('cors')
const labelRouter = require('./routes/label-routes')
const app = express()

app.use(express.json())
app.use(cors())
app.use('/esl-system/v1/labels', labelRouter)

module.exports = app
