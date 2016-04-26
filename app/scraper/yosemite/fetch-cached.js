var download = require('./download');
var memoize = require('memoizee');

module.exports = function fetchCached(options) {
  var maxAge = options.maxAge;

  return memoize(download, { maxAge: maxAge });
}
