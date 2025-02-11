const dotenv = require('dotenv')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

dotenv.config({ path: '.env' });
const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
