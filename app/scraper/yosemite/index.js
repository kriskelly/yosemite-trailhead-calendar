var transform = require('./transform.js'),
    parse = require('./parse');
var fetchCached = require('./fetch-cached');
var searchTrailheads = require('./search');

var CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in ms

var calendarize = require('./calendarize');
var _ = require('lodash-fp');


/**
 * 
 * Options are the following:
 * - maxAge: maxAge param used by memoizee
 *
 * @param options
 * @returns {Promise.<TResult>} Promise A promise that resolves calendar events to display on the web
 */
function createScraper(options) {
  var cachedFetcher = fetchCached({
    maxAge: CACHE_EXPIRATION_TIME
  });

  /**
   * Do the actual scraping of the PDF.
   *
   * Options include:
   * - search: search terms used to filter calendar results
   *
   * @param options
   * @returns {Promise.<TResult>}
   */
  function scrape(options) {
    return cachedFetcher()
      .then(parse)
      .then(transform)
      .then(function (trailheads) {
        if (options.search) {
          return searchTrailheads(trailheads, options.search);
        } else {
          return trailheads;
        }
      }).then(calendarize);
  }
  return scrape;
}

module.exports = createScraper;