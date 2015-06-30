var _ = require('lodash-fp'),
    util = require('../util'),
    monthToInt = util.monthToInt;

var extractDay = _.parseInt(10);

// Input = Array of strings
// Output = Array of objects, 1 for each trailhead
var accumulator = {
  trailheads: [],
  currentTrailhead: {},
  currentMonth: null
};

var groupByTrailhead = _.reduce(function(acc, str) {
  var day, month;
  if (month = monthToInt(str)) {
    acc.currentMonth = month;
    acc.currentTrailhead.months[month] = [];
  } else if (day = extractDay(str)) {
    acc.currentTrailhead.months[acc.currentMonth].push(day);
  } else {
    // Is a trailhead. It might be a new one or an existing trailhead.
    var trailhead;
    if (!(trailhead = _.find({name: str}, acc.trailheads))) {
      trailhead = {
        name: str,
        months: {}
      };
      acc.trailheads.push(trailhead);
    }
    acc.currentTrailhead = trailhead;
    acc.currentMonth = null;
  }
  return acc;
}, _.create(accumulator));

// var combineEmptyTrailheads = _.reduce(function(acc, trailhead, i) {
//   if (!_.keys(trailhead.months).length) {
//     console.log(trailhead);
//   }
//   return acc;
// }, []);

module.exports = _.flow(
  groupByTrailhead,
  _.property('trailheads')
  // combineEmptyTrailheads
);