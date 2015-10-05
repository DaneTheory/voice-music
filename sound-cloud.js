var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('util');

const SC_URL = 'http://api.soundcloud.com/tracks';
const CLIENT_ID = 'ed292956bbac43c1bdb9147ad764d61f';
const CLIENT_SECRET = '52f602b2908784b97c99c559ae06360a';

function processResult(result) {
  return {
    name: result.title,
    src: util.format('%s?client_id=%s', result.stream_url, CLIENT_ID),
  };
}

module.exports = {
  search: function(query) {
    var url = util.format('%s?client_id=%s&q=%s', SC_URL, CLIENT_ID, query);
    return request(url).then(function(contents) {
      var tracks = JSON.parse(contents[0].body);
      return tracks.map(processResult);
    });
  },
};
