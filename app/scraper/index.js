var Promise = require('bluebird'),
    fs = require('fs-extra'),
    request = Promise.promisify(require('request')),
    PDFParser = require('pdf2json/pdfparser'),
    urlencode = require('urlencode'),
    _ = require('lodash-fp'),
    moment = require('moment'),
    memoize = require('memoizee');;

Promise.promisifyAll(fs);

var pdfUrl = 'http://www.nps.gov/yose/planyourvisit/upload/fulltrailheads.pdf';

var makeRequest = function() {
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

var dumpAndLeave = function(output) {
  console.log(output);
  process.exit();
};

var parsePdf = function(buf) {
  var parser = new PDFParser();
  var p = new Promise(function(resolve, reject) {
    parser.on("pdfParser_dataReady", resolve);
    parser.on("pdfParser_dataError", reject);
  });
  parser.parseBuffer(buf);
  return p;
}

var extractStrings = _.flow(_.flatten, _.map(function(page) {
  return _.map(function(text) {
    return urlencode.decode(text.R[0].T);
  }, page.Texts);
}), _.flatten);

var extractTrailheadData = _.takeWhile(_.negate(_.includes('Donohue Exit Quota')));

var garbageStrings = [
  'WPS Full Trailheads Report',
  'First',
  'Previous',
  'Next',
  'Last',
  'Date'
];

var cleanData = _.filter(function(str) {
  return _.indexOf(str, garbageStrings) === -1 && !_.includes('No reservations are available', str);
});

var extractDay = _.parseInt(10);

var availableMonths = {
  'May': 5,
  'June': 6,
  'July': 7,
  'August': 8,
  'September': 9,
  'October': 10
};

var extractMonth = function(str) {
  return availableMonths[str];
};

// Input = Array of strings
// Output = Array of objects, 1 for each trailhead
var accumulator = {
  trailheads: [],
  currentTrailhead: {},
  currentMonth: null
};

var currentYear = 2015;

var groupByTrailhead = _.reduce(function(acc, str) {
  var day, month;
  if (month = extractMonth(str)) {
    acc.currentMonth = month;
    acc.currentTrailhead.months[month] = [];
  } else if (day = extractDay(str)) {
    acc.currentTrailhead.months[acc.currentMonth].push(day);
  } else {
    // Is a trailhead.
    var trailhead = {
      name: str,
      months: {}
    };
    acc.currentTrailhead = trailhead;
    acc.trailheads.push(trailhead);
  }
  return acc;
}, accumulator);

// Can't get _.zipObject to work for some reason.
var zipObject = _.reduce(function(acc, pair) {
  return _.spread(function(k, v) {
    acc[k] = v;
    return acc;
  })(pair);
}, {});

var mapSpread = function(iteratee) {
  return _.flow(
    _.pairs,
    _.map(_.spread(iteratee))
  );
};

// Also not sure why _.mapValues does not seem to be working.
// This is not quite a replacement for _.mapValues.
var mapValues = function(iteratee) {
  return _.flow(
    mapSpread(iteratee),
    zipObject
  );
};

var daysPerMonth = {
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31
};

var remainingDays = function(month, days) {
  return _.difference(_.range(1, daysPerMonth[month] + 1), days)
};

// Convert lists of full dates -> lists of non-full dates.
var doInversion = mapValues(function(month, days) {
  return [month, remainingDays(month, days)];
});

var invertDates = _.map(function(trailhead) {
  trailhead.months = doInversion(trailhead.months);
  return trailhead;
});

var formatDate = _.curry(function(year, month, day) {
  return [month, day, year].join('/');
});

var removeInvalidDates = _.filter(function(date) {
  return moment(new Date(date)).isValid();
});

var toFormattedDates = _.flow(
  mapSpread(function(month, days) {
    return _.map(formatDate(currentYear, month), days)
  }),
  _.flatten,
  removeInvalidDates
);

var convertToDates = _.map(function(trailhead) {
  trailhead.dates = toFormattedDates(trailhead.months);
  // console.log(trailhead.dates);process.exit();
  delete trailhead.months;
  return trailhead;
});

var extractFromPages = _.flow(
  extractStrings,
  extractTrailheadData,
  _.map(_.trim),
  cleanData,
  groupByTrailhead,
  _.property('trailheads'),
  invertDates, // list includes full dates, find non-full dates.
  convertToDates
);

// Returns a promise that resolves to an array of trailheads.
function scrape() {
  return makeRequest().spread(function(response, body) {
    return parsePdf(body);
  }).then(function(doc) {
    return doc.data.Pages;
  }).then(extractFromPages).then(function(trailheads) {
    console.log('successfully scraped trailhead data');
    return trailheads;
  });
}

var expirationTime = 24 * 60 * 60 * 1000; // 1 day in ms
module.exports = memoize(scrape, {maxAge: expirationTime});