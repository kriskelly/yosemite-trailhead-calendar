var Promise = require('bluebird'),
    request = Promise.promisify(require('request'));

var pdfUrl = 'http://www.nps.gov/yose/planyourvisit/upload/fulltrailheads.pdf';

var makeRequest = function() {
  console.log('requesting PDF');
  return request({
    url: pdfUrl,
    encoding: null
  });
}

module.exports = function() {
  return makeRequest().spread(function(response, body) {
    console.log('PDF downloaded. Parsing...');
    return body;
  });
};