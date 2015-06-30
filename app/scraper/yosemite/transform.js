var _ = require('lodash-fp'),
    moment = require('moment'),
    extractStrings = require('./extract'),
    reduceTrailheads = require('./reduce'),
    util = require('../util'),
    remainingDays = util.remainingDays;
    
var currentYear = 2015;

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
  return {
    name: trailhead.name,
    dates: toFormattedDates(trailhead.months)
  };
});

var transform = _.flow(
  extractStrings,
  reduceTrailheads,
  invertDates, // list includes full dates, find non-full dates.
  convertToDates
);

module.exports = transform;