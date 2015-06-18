var _ = require('lodash-fp');

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

var availableMonths = {
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