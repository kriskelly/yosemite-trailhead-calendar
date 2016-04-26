var Promise = require('bluebird');
var fs = require('fs');
var download = require('../download');

var readFile = Promise.promisify(fs.readFile);

// Ugh. Not ideal but better than downloading the PDF every time we restart in dev mode.
var fixturePath = 'test/app/scraper/yosemite/fixtures/fulltrailheads.pdf';
var realURL = 'http://www.nps.gov/yose/planyourvisit/upload/fulltrailheads.pdf';


module.exports = function downloadUnlessCached() {
  console.log('Attemping to download');
  if (process.env.NODE_ENV === 'production') {
    return download(realURL);
  } else {
    console.log('Reading cached PDF');
    return readFile(fixturePath);
  }
}
