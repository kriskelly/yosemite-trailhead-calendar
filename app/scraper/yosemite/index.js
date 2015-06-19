var transform = require('./transform.js'),
    download = require('./download'),
    parse = require('./parse');

var dumpAndLeave = function(output) {
  console.log(output);
  process.exit();
};

// Returns a promise that resolves to an array of trailheads.
function scrape() {
  return download()
    .then(parse)
    .then(transform)
    .then(function(trailheads) {
    console.log('successfully scraped trailhead data');
    return trailheads;
  });
}

module.exports = scrape;