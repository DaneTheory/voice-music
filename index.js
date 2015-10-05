var util = require('util');
var express = require('express');
var twilio = require('twilio');

require('./polyfill');
var twiml = require('./twiml');
var commands = require('./commands');
var history = require('./history');


var app = express();
app.set('port', (process.env.PORT || 5000));

var smsResponder = twiml.Responder(function(req) {
  var msg = req.query.Body;
  var result = commands.run(msg, req);
  if (result) {
    return result;
  } else {
    return util.format('Hello, %s. How can I help you today?', req.user.name);
  }
});

var playResponder = twiml.Responder(function(req) {
  var historyResults = history.getResults(req.query.q);
  var wantedResult = historyResults[req.query.num];
  return new twilio.TwimlResponse()
    // .say('')
    .play(wantedResult.src);
});

app.get('/sms', smsResponder);

app.post('/play', playResponder);

// app.get('/sms', twiml.Responder(function(res, req) {
//   res.message(util.format('Hello, %s. How can I help you today?', req.user.name));
// }));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


