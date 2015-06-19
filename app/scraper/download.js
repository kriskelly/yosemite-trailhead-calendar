var Promise = require('bluebird'),
    request = Promise.promisify(require('request'));

module.exports = function(url) {
  console.log('Downloading...');
  return request({
    url: url,
    encoding: null
  }).spread(function(response, body) {
    console.log('Downloaded. Parsing...');
    return body;
  });
};