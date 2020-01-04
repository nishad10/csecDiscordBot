"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var packageInfo = require('../package.json');

var app = express();
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.json({
    name: 'csecDiscordBot',
    version: '1.0.0',
    description: 'Hackerman',
    repository: 'https://github.com/nishad10/csecDiscordBot',
    author: 'Nishad Aherrao',
    license: 'GNU GPL'
  });
});
var server = app.listen(process.env.PORT, function () {
  var port = server.address().port;
  console.info('Web server started at http://localhost:%s', port);
});

module.exports = function (bot) {
  app.post('/', function (req, res) {
    res.sendStatus(200);
  });
};
//# sourceMappingURL=app.js.map