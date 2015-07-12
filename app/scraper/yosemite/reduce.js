'use strict';

var _ = require('lodash-fp'),
    util = require('../util'),
    monthToInt = util.monthToInt;

var extractDay = _.parseInt(10);

var groupByTrailhead = function(arr) {
  // Input = Array of strings
  // Output = Array of objects, 1 for each trailhead
  var accumulator = {
    trailheads: [],
    currentTrailhead: {},
    currentMonth: null,
    previous: null
  };

  return _.reduce(function(acc, str) {
    var day, month, trailhead;
    if (month = monthToInt(str)) {
      acc.currentMonth = month;
      acc.currentTrailhead.months[month] = [];
      acc.previous = 'month';
    } else if (day = extractDay(str)) {
      acc.currentTrailhead.months[acc.currentMonth].push(day);
      acc.previous = 'day';
    } else {
      // Is a trailhead. It might be a new one or an existing trailhead.
      if (!(trailhead = _.find({name: str}, acc.trailheads))) {
        if (acc.previous === 'trailhead') {
          acc.currentTrailhead.name += ' ' + str;
        } else {
          trailhead = {
            name: str,
            months: {}
          };
          acc.trailheads.push(trailhead);
          acc.currentTrailhead = trailhead;
        }
      }
      acc.previous = 'trailhead';
      acc.currentMonth = null;
    }
    return acc;
  }, accumulator, arr);
}

module.exports = _.flow(
  groupByTrailhead,
  _.property('trailheads')
);