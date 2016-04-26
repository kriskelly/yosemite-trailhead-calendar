var moment = require('moment');
var _ = require('lodash-fp');

function searchTrailheads(trailheads, terms) {
  // Case-insensitive search.
  var normalizedTerms = terms.toLowerCase();
  return _.filter(function (trailhead) {
    var normalizedName = trailhead.name.toLowerCase();
    if (normalizedName.indexOf(normalizedTerms) > -1) {
      return true;
    }
  }, trailheads);
}

var today;
var skipOldDates = _.filter(function(date) {
  var momentDate = moment(new Date(date));
  if (!today) {
    today = new Date();
  }
  return momentDate.isAfter(today);
});

var createEvent = _.curry(function(title, date) {
  return {
    title: title,
    start: date,
    allDay: true
  };
});

/**
 * Convert trailhead data into calendar events.
 *
 * @return array array of calendar events
 */
var calendarize = _.flow(
  _.map(function(trailhead) {
    var processDates = _.flow(
      skipOldDates,
      _.map(createEvent(trailhead.name))
    );

    return processDates(trailhead.dates);
  }),
  _.flatten
);

module.exports = calendarize;