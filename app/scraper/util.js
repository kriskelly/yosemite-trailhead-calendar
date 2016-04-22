var _ = require('lodash-fp');

var daysPerMonth = {
  'May': 31,
  'June': 30,
  'July': 31,
  'August': 31,
  'September': 30,
  'October': 31
};

var remainingDays = function(month, days) {
  return _.difference(_.range(1, daysPerMonth[month] + 1), days)
};

var availableMonths = {
  'April': 4,
  'May': 5,
  'June': 6,
  'July': 7,
  'August': 8,
  'September': 9,
  'October': 10
};

var monthToInt = function(str) {
  return availableMonths[str];
};

module.exports = {
  remainingDays: remainingDays,
  monthToInt: monthToInt
};