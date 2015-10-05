var util = require('util');
var express = require('express');

require('./polyfill');
var twiml = require('./twiml');

var app = express();
app.set('port', (process.env.PORT || 5000));

var smsResponder = twiml.Responder(function(res, req) {
  res.message(JSON.stringify(req.query));
});

app.get('/sms', smsResponder);

// app.get('/sms', twiml.Responder(function(res, req) {
//   res.message(util.format('Hello, %s. How can I help you today?', req.user.name));
// }));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


