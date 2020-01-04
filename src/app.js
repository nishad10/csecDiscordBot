const express = require('express')
const bodyParser = require('body-parser')
const packageInfo = require('../package.json')

const app = express()
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.json({
    name: 'csecDiscordBot',
    version: '1.0.0',
    description: 'Hackerman',
    repository: 'https://github.com/nishad10/csecDiscordBot',
    author: 'Nishad Aherrao',
    license: 'GNU GPL',
  })
})
var server = app.listen(process.env.PORT, () => {
  const port = server.address().port
  console.info('Web server started at http://localhost:%s', port)
})

module.exports = bot => {
  app.post('/', (req, res) => {
    res.sendStatus(200)
  })
}
