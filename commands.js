var Promise = require('bluebird');
var twilio = require('twilio');
var util = require('util');

var history = require('./history');

const HOST = 'http://voice-music.herokuapp.com';
const ACCOUNT_SID = 'AC06763f165379a494e3f9bdfdbb0c55f7';
const AUTH_TOKEN = 'bea6081ce8b239386f01fd20a59d1de8';

var client = new twilio.RestClient(ACCOUNT_SID, AUTH_TOKEN);

var MOCK_RESULTS = [
  {name: 'Rihanna Diamonds', src: 'https://www.dropbox.com/s/ab1n6qs94fo31v8/Rihanna_Diamonds.mp3?dl=1'},
  {name: 'Rihanna Only Girl', src: 'https://www.dropbox.com/s/33vrfjq8qzau5lx/Rihanna_Only_Girl.mp3?dl=1'},
  {name: 'Rihanna Stay', src: 'https://www.dropbox.com/s/tvevmiyq7vn50rj/Rihanna_Stay.mp3?dl=1'},
];

var commands = {
  'Search for': function(cmd, req, succ, err) {
    history.addSearch(cmd);
    // Do the actual search, and add results to the history.
    var results = MOCK_RESULTS;
    history.addResults(cmd, results);
    var parts = results.map(function(r, i) {
      return util.format('%d. %s', i + 1, r.name);
    });
    succ(parts.join('\n'));
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
