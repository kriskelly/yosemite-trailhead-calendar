var Promise = require('bluebird'),
    fs = require('fs-extra'),
    request = Promise.promisify(require('request')),
    PDFParser = require('pdf2json/pdfparser');

Promise.promisifyAll(fs);

var pdfUrl = 'http://www.nps.gov/yose/planyourvisit/upload/fulltrailheads.pdf';

var makeRequest = function() {
  console.log('requesting PDF');
  return request({
    url: pdfUrl,
    encoding: null
  });
}

// var localPdfPath = './fulltrailheads.pdf';
// var makeRequest = function() {
//   return fs.readFileAsync(localPdfPath).then(function(data) {
//     return [null, data];
//   });
// }

var parsePdf = function(buf) {
  var parser = new PDFParser();
  var p = new Promise(function(resolve, reject) {
    parser.on("pdfParser_dataReady", resolve);
    parser.on("pdfParser_dataError", reject);
  });
  parser.parseBuffer(buf);
  return p;
}

module.exports = function() {
  return makeRequest().spread(function(response, body) {
    console.log('PDF downloaded. Parsing...');
    return parsePdf(body);
  });
}