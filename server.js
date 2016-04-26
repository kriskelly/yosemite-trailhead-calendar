var static = require('node-static');
var createYosemiteScraper = require('./app/scraper/yosemite');
var _ = require('lodash-fp');

var CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day in ms

var file = new static.Server('./public');

var endpoints = [
  [/yosemite-calendar-events\.json/, createYosemiteScraper()]
];

require('http').createServer(function (request, response) {
  request.addListener('end', function () {

    var scraper;
    var endpoint = _.find(function (endpoint) {
      return endpoint[0].test(request.url);
    }, endpoints);
    if (endpoint) {
      scraper = endpoint[1];
    }

    if (scraper) {
      scraper({
        maxAge: CACHE_EXPIRATION_TIME
      }).then(function(data) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(data));
        response.end();
      })
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(process.env.PORT || 8080);