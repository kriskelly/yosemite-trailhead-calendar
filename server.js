var static = require('node-static'),
    yosemiteScraper = require('./app/scraper/yosemite'),
    eldoradoScraper = require('./app/scraper/eldorado'),
    memoize = require('memoizee'),
    R = require('ramda');

var expirationTime = 24 * 60 * 60 * 1000; // 1 day in ms
var memoizedYosemiteScraper = memoize(yosemiteScraper, {maxAge: expirationTime});
var memoizedEldoradoScraper = memoize(eldoradoScraper, {maxAge: expirationTime});

var file = new static.Server('./public');

var endpoints = [
  [/available\-trailheads\.json/, memoizedYosemiteScraper],
  [/eldorado\-campgrounds\.json/, memoizedEldoradoScraper]
];


require('http').createServer(function (request, response) {
  request.addListener('end', function () {

    var findScraper = R.pipe(R.find(function(x) {
      return x[0].test(request.url);
    }), R.ifElse(R.isNil, R.identity, R.nth(1)));

    if (scraper = findScraper(endpoints)) {
      scraper().then(function(data) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(data));
        response.end();
      })
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(process.env.PORT || 8080);