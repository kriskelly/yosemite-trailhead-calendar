var urlencode = require('urlencode'),
    _ = require('lodash-fp'),
    moment = require('moment'),
    util = require('../util'),
    remainingDays = util.remainingDays,
    monthToInt = util.monthToInt;

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
  if (month = monthToInt(str)) {
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

var transform = _.flow(
  extractStrings,
  extractTrailheadData,
  _.map(_.trim),
  cleanData,
  groupByTrailhead,
  _.property('trailheads'),
  invertDates, // list includes full dates, find non-full dates.
  convertToDates
);

module.exports = transform;