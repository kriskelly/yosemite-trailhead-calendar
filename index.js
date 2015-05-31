var Promise = require('bluebird'),
    fs = require('fs-extra'),
    request = Promise.promisify(require('request')),
    PDFParser = require('pdf2json/pdfparser'),
    urlencode = require('urlencode'),
    _ = require('lodash-fp');

Promise.promisifyAll(fs);

var pdfUrl = 'http://www.nps.gov/yose/planyourvisit/upload/fulltrailheads.pdf';

var localPdfPath = './fulltrailheads.pdf';
var localJsonPath = './public/available-trailheads.json';

// var makeRequest = function() {
//   return request({
//     url: pdfUrl,
//     encoding: null
//   });
// }

var makeRequest = function() {
  return fs.readFileAsync(localPdfPath).then(function(data) {
    return [null, data];
  });
}

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

// Convert lists of full dates -> lists of non-full dates.
var invertDates = _.map(function(trailhead) {
  trailhead.months = _.mapValues(function(days) {
    return _.difference(_.range(1, 32), days);
  }, trailhead.months);
  return trailhead;
});

var formatDate = _.curry(function(year, month, day) {
  return [month, day, year].join('/');
});

var convertToDates = _.map(function(trailhead) {
  var toDates = _.flow(
    _.pairs,
    _.map(function(pair) {
      var days = pair[1];
      var month = pair[0];
      return _.map(formatDate(currentYear, month), days);
    }),
    _.flatten
  );
  trailhead.dates = toDates(trailhead.months);
  delete trailhead.months;
  return trailhead;
});

var extractFromPages = _.flow(
  extractStrings,
  extractTrailheadData,
  _.map(_.trim),
  cleanData,
  groupByTrailhead,
  function(acc) { return _.result('trailheads', acc); }, // No idea why this works but _.result('trailheads') does not.
  invertDates, // list includes full dates, find empty dates.
  convertToDates
);

makeRequest().spread(function(response, body) {
  return parsePdf(body);
}).then(function(doc) {
  return doc.data.Pages; 
}).then(extractFromPages).then(function(trailheads) {
  return fs.writeFileAsync(localJsonPath, JSON.stringify(trailheads));
}).then(function() {
  console.log('successfully wrote JSON');
});