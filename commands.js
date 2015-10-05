var Promise = require('bluebird');
var twilio = require('twilio');
var util = require('util');

var soundCloud = require('./sound-cloud');
var history = require('./history');

const HOST = 'http://voice-music.herokuapp.com';
const ACCOUNT_SID = 'AC06763f165379a494e3f9bdfdbb0c55f7';
const AUTH_TOKEN = 'bea6081ce8b239386f01fd20a59d1de8';

var client = new twilio.RestClient(ACCOUNT_SID, AUTH_TOKEN);

var commands = {
  'Search for': function(cmd, req, succ, err) {
    history.addSearch(cmd);
    soundCloud.search(cmd).then(function(results) {
      history.addResults(cmd, results);
      var parts = history.getResults(cmd).map(function(r, i) {
        return util.format('%d. %s', i + 1, r.name);
      });
      succ(parts.join('\n'));
    }).catch(err);

  },
  'Play': function(cmd, req, succ, err) {
    var query = history.getSearches().shift();
    var num = parseInt(cmd, 10) - 1;
    client.makeCall({
      to: req.user.id,
      from: req.query.To, // The Twilio number.
      url: util.format('%s/play?q=%s&num=%d', HOST, encodeURIComponent(query), num),
    });
    succ('Playing...');
  },
};

module.exports = {
  run: function(msg, req) {
    for (var prefix in commands) {
      var matchPrefix = prefix + ' ';
      if (msg.iStartsWith(matchPrefix)) {
        return new Promise(function(resolve, reject) {
          var cmd = msg.substr(matchPrefix.length);
          commands[prefix](cmd, req, resolve, reject);
        });
      }
    }
    return false;
  },
};
