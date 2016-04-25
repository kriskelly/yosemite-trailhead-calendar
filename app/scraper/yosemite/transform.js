var _ = require('lodash-fp'),
    moment = require('moment'),
    extractStrings = require('./extract'),
    reduceTrailheads = require('./reduce'),
    util = require('../util'),
    monthToInt = util.monthToInt,
    remainingDays = util.remainingDays;
    
var currentYear = (new Date()).getFullYear();

var mapSpread = function(iteratee) {
  return _.flow(
    _.pairs,
    _.map(_.spread(iteratee))
  );
};

// Convert lists of full dates -> lists of non-full dates.
function doInversion (monthData) {
  var invertedDates = {};
  _.each(function (days, month) {
    invertedDates[month] = remainingDays(month, days);
  }, monthData);

  return invertedDates;
}

var invertDates = _.map(function(trailhead) {
  trailhead.months = doInversion(trailhead.months);
  return trailhead;
});

var formatDate = _.curry(function(year, month, day) {
  return [monthToInt(month), day, year].join('/');
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
  return {
    name: trailhead.name,
    dates: toFormattedDates(trailhead.months)
  };
});

function transform (pdfData) {
  var strings = extractStrings(pdfData);
  var trailheads = reduceTrailheads(strings);
  var invertedTrailheadData = invertDates(trailheads);
  var trailheadsWithDates = convertToDates(invertedTrailheadData);
  return trailheadsWithDates;
}

module.exports = transform;