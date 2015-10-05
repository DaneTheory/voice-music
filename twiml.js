var twilio = require('twilio');
var Promise = require('bluebird');

var contacts = require('./contacts');

function getUser(req) {
  var number = req.query.From;
  return {
    id: number,
    name: contacts.getName(number),
  };
}

function isTwimlResponse(response) {
  return response.constructor.name == 'Node';
}

function respond(res, result) {
  if (result instanceof Promise) {
    result
    .then(function(response) { respond(res, response); })
    .catch(function() { res.end(); });
  } else if (isTwimlResponse(result)) {
    res.send(result.toString());
  } else if (typeof result == 'string') {
    sendTwimlSms(res, result);
  } else {
    res.end();
  }
}

function sendTwimlSms(res, msg) {
  var twimlResponse = new twilio.TwimlResponse();
  twimlResponse.message(msg);

  res.set('Content-Type', 'text/html');
  res.send(twimlResponse.toString());
}

module.exports = {
  Responder: function(fn) {
    return function(req, res) {
      req.user = getUser(req);
      var result = fn(req);
      respond(res, result);
    };
  },
};
