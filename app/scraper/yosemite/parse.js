var Promise = require('bluebird'),
    PDFParser = require('pdf2json/pdfparser');

module.exports = function parsePdf(buf) {
  var parser = new PDFParser();
  var p = new Promise(function(resolve, reject) {
    parser.on("pdfParser_dataReady", function(doc) {
      return resolve(doc.data.Pages);
    });
    parser.on("pdfParser_dataError", reject);
  });
  parser.parseBuffer(buf);
  return p;
}
