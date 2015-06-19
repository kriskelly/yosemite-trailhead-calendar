var parse = require('../../app/scraper/yosemite/parse'),
    expect = require('chai').expect,
    fs = require('fs');

var pdfPath = __dirname + '/fixtures/fulltrailheads.pdf';

describe('yosemite parse', function() {
  beforeEach(function() {
    this.buf = fs.readFileSync(pdfPath);
  });
  it('works on the PDF', function(done) {
    parse(this.buf).then(function(pages) {
      expect(pages).to.exist;
      expect(pages).to.be.instanceOf(Array);
    }).then(done);
  });
});