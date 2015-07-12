var parse = require('../../../../app/scraper/yosemite/parse'),
    extract = require('../../../../app/scraper/yosemite/extract'),
    expect = require('chai').expect,
    fs = require('fs'),
    _ = require('lodash-fp');

var pdfPath = __dirname + '/fixtures/fulltrailheads.pdf';

describe('yosemite extract strings from PDF', function() {
  this.timeout(3000);

  beforeEach(function() {
    this.buf = fs.readFileSync(pdfPath);
  });

  it('extracts an array of strings from the PDF', function(done) {
    parse(this.buf).then(extract).then(function(strs) {
      expect(strs).to.be.instanceof(Array);
      expect(strs).to.have.length.above(0);
    }).then(done);
  });

  it('does not include any of the Donahue Exit Quota pages', function(done) {
    parse(this.buf).then(extract).then(function(strs) {
      expect(strs.join('')).to.not.contain('Donohue Exit Quota');
    }).then(done);
  });

  it('does not include non-info strings like First, Last, Previous', function(done) {
    parse(this.buf).then(extract).then(function(strs) {
      expect(strs).to.not.include('First');
      expect(strs).to.not.include('Last');
      expect(strs).to.not.include('Previous');
      expect(strs).to.not.include('Next');
    }).then(done);
  });
});