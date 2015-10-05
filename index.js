var util = require('util');
var express = require('express');

var twiml = require('./twiml');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/sms', twiml.Responder(function(resp, user) {
  resp.message(util.format('Hello, %s. How can I help you today?', user.name));
}));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


