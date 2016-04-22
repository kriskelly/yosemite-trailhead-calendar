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

function extract(data) {
  var usefulData = skipFirstPage(data);
  var stringsByPage = _.map(getPdfPageTextStrings, usefulData);
  var allStrings = _.flatten(rejectDonahueData(stringsByPage));
  var trailheadData = cleanData(allStrings);
  return trailheadData;
}

function getPdfPageTextStrings(pageObj) {
  var texts = pageObj.Texts;
  return _.map(function (text) {
    return urlencode.decode(text.R[0].T)
  }, texts);
}

function rejectDonahueData(pages) {
  return _.reject(_.any(_.includes('Donohue Exit Quota')), pages); // Reject any 'Donahue Exit Quota' pages b/c they mess up the transformer.
}

function skipFirstPage(data) {
  return data.slice(1);

}

module.exports = extract;