var ingest = require('./ingest.js'),
    transform = require('./transform.js'),
    memoize = require('memoizee');

var dumpAndLeave = function(output) {
  console.log(output);
  process.exit();
};

// Returns a promise that resolves to an array of trailheads.
function scrape() {
  return ingest().then(function(doc) {
    return doc.data.Pages;
  }).then(transform).then(function(trailheads) {
    console.log('successfully scraped trailhead data');
    return trailheads;
  });
}

var expirationTime = 24 * 60 * 60 * 1000; // 1 day in ms
module.exports = memoize(scrape, {maxAge: expirationTime});