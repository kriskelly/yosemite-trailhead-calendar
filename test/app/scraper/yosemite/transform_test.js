var parse = require('../../../../app/scraper/yosemite/parse'),
    transform = require('../../../../app/scraper/yosemite/transform'),
    expect = require('chai').expect,
    fs = require('fs'),
    _ = require('lodash-fp');

var pdfPath = __dirname + '/fixtures/fulltrailheads.pdf';

describe('yosemite transform', function() {
  var trailheads;

  beforeEach(function() {
    this.buf = fs.readFileSync(pdfPath);
    return parse(this.buf).then(transform).then(function (results) {
      trailheads = results;
    })
  });

  it('works on the PDF', function() {
    expect(trailheads).to.be.instanceof(Array);
  });

  it('does not output duplicate trailheads', function() {
    var uniqueNames = _.uniq(_.map(_.property('name'), trailheads));
    expect(uniqueNames.length).to.equal(trailheads.length);
  });

  it('outputs trailheads populated with the available dates', function () {
    var trailhead = trailheads[0];
    expect(trailhead.name).to.equal('Beehive Meadows');
    expect(trailhead.dates.length).to.be.greaterThan(0);
  });
});