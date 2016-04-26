var transform = require('./transform.js'),
    parse = require('./parse');
var fetchCached = require('./fetch-cached');

var CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in ms

var calendarize = require('./calendarize');


/**
 * 
 * Options are the following:
 * - maxAge: maxAge param used by memoizee
 * - search: search terms used to filter calendar results
 * 
 * @param options
 * @returns {Promise.<TResult>} Promise A promise that resolves calendar events to display on the web
 */
function createScraper(options) {
  var cachedFetcher = fetchCached({
    maxAge: CACHE_EXPIRATION_TIME
  });

  function scrape() {
    return cachedFetcher()
      .then(parse)
      .then(transform)
      .then(calendarize);
  }
  return scrape;
}

module.exports = createScraper;