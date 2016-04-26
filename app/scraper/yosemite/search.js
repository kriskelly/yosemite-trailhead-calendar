var _ = require('lodash-fp');

/**
 * Search the trailheads using the provided search term.
 *
 * @param trailheads array
 * @param search string
 * @return array
 */
module.exports = function searchTrailheads(trailheads, search) {
  var normalizedTerms = search.toLowerCase();
  var results = _.filter(function (trailhead) {
    return trailhead.name.toLowerCase().indexOf(normalizedTerms) > -1;
  }, trailheads);
  console.log('Found ' + results.length + ' results for search: ' + search);
  return results;
};
