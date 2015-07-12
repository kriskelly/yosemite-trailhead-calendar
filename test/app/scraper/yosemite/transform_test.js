var parse = require('../../../../app/scraper/yosemite/parse'),
    transform = require('../../../../app/scraper/yosemite/transform'),
    expect = require('chai').expect,
    fs = require('fs'),
    _ = require('lodash-fp');

var pdfPath = __dirname + '/fixtures/fulltrailheads.pdf';

describe('yosemite transform', function() {
  beforeEach(function() {
    this.buf = fs.readFileSync(pdfPath);
  });

  it('works on the PDF', function(done) {
    parse(this.buf).then(transform).then(function(trailheads) {
      expect(trailheads).to.be.instanceof(Array);
    }).then(done);
  });

  it('does not output duplicate trailheads', function(done) {
    parse(this.buf).then(transform).then(function(trailheads) {
      var uniqueNames = _.uniq(_.map(_.property('name'), trailheads));
      expect(uniqueNames.length).to.equal(trailheads.length);
    }).then(done);
  });
});