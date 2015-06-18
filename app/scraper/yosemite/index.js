var ingest = require('./ingest.js'),
    transform = require('./transform.js');


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

module.exports = scrape;