var R = require('ramda');

function extractTableText(parsedHTML) {
  return parsedHTML('table table').text();
}

function splitLines(text) {
  return text.split("\n");
}

let trimWhitespace = R.map(x => x.trim());

let dropEmptyLines = R.reject(x => x.length === 0);

let stripInitialNonsense = R.pipe(R.dropWhile(x => x !== 'Campground List'), R.drop(1));

const nameRegex = /CAMPGROUND NAME: ([\w ]+)/
const unreservableRegex = /RESERVATIONS: No/
const siteCountRegex = /Total Sites: (\d+)/
const elevationRegex = /The elevation is (.+) ft\./
const costRegex = /Rate: (.+)/

function campgroundFsm() {
  var acc = {
    campgrounds: [],
    currentCampground: null
  };
  return R.pipe(R.reduce(function(acc, line) {
    var matches;
    if (matches = nameRegex.exec(line)) {
      var campground = {
        name: matches[1],
        takesReservations: true,
        siteCount: 0,
        elevation: null,
        cost: null
      };
      acc.campgrounds.push(campground);
      acc.currentCampground = campground;
    } else if (unreservableRegex.test(line)) {
      acc.currentCampground.takesReservations = false;
    } else if (matches = siteCountRegex.exec(line)) {
      acc.currentCampground.siteCount = parseInt(matches[1]);
    } else if (matches = elevationRegex.exec(line)) {
      acc.currentCampground.elevation = parseInt(matches[1].replace(',', ''));
    } else if (matches = costRegex.exec(line)) {
      acc.currentCampground.cost = matches[1];
    }
    return acc;
  }, acc), R.prop('campgrounds')); // Grab the campgrounds off the accumulator when we're done.
}

let removeDuplicates = R.uniqWith((a, b) => a.name === b.name);

module.exports = R.pipe(
  extractTableText,
  splitLines,
  trimWhitespace,
  dropEmptyLines,
  stripInitialNonsense,
  campgroundFsm(),
  removeDuplicates);