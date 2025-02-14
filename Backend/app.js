const express = require('express')
const cors = require('cors')
const labelRouter = require('./routes/label-routes')
const templateRouter = require('./routes/template-routes')
const app = express()

app.use(express.json())
app.use(cors())
app.use('/esl-system/v1/labels', labelRouter)
app.use('/esl-system/v1/templates', templateRouter)

module.exports = app
