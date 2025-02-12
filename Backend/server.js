const app = require('./app')

const PORT = process.env.PORT || 300

app.listen(PORT, () => {
  console.log(`app running`)
})
