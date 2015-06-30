var parseHtml = require('../../app/scraper/parse_html'),
    transform = require('../../app/scraper/eldorado/transform'),
    expect = require('chai').expect,
    fs = require('fs');

var localFilePath = __dirname + '/fixtures/eldocmp.html';

describe('eldorado transform', function() {
  beforeEach(function() {
    this.buf = fs.readFileSync(localFilePath);
  });
  
  it('works on the HTML file', function() {
    var campgrounds = transform(parseHtml('table table', this.buf));
    expect(campgrounds).to.be.instanceof(Array);
    expect(campgrounds).to.have.length.above(0);
  });
});