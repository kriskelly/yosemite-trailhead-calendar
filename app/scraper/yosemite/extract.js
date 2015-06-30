var urlencode = require('urlencode'),
    _ = require('lodash-fp');

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

module.exports = _.flow(
  _.map(_.property('Texts')),
  _.map(_.map(function(text) {
    return urlencode.decode(text.R[0].T);
  })), // Map all the PDF pages to an array of arrays of strings
  _.reject(_.any(_.includes('Donohue Exit Quota'))), // Reject any 'Donahue Exit Quota' pages b/c they mess up the transformer.
  _.flatten,
  _.map(_.trim),
  cleanData
);
