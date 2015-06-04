var static = require('node-static');
var scrapePdf = require('./app/scraper');

var file = new static.Server('./public');

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    if (/available\-trailheads\.json/.test(request.url)) {
      scrapePdf().then(function(trailheads) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(trailheads));
        response.end();
      });
    } else {
      file.serve(request, response);
    }
  }).resume();
}).listen(process.env.PORT || 8080);