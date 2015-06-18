var static = require('node-static'),
    scrape = require('./app/scraper/yosemite'),
    memoize = require('memoizee');

var expirationTime = 24 * 60 * 60 * 1000; // 1 day in ms
var memoizedScrape = memoize(scrape, {maxAge: expirationTime});

var file = new static.Server('./public');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    if (/available\-trailheads\.json/.test(request.url)) {
      memoizedScrape().then(function(trailheads) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(trailheads));
        response.end();
      });
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(process.env.PORT || 8080);