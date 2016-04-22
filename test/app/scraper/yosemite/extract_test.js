var parse = require('../../../../app/scraper/yosemite/parse'),
    extract = require('../../../../app/scraper/yosemite/extract'),
    expect = require('chai').expect,
    fs = require('fs'),
    _ = require('lodash-fp');

var pdfPath = __dirname + '/fixtures/fulltrailheads.pdf';

describe('yosemite extract strings from PDF', function() {
  this.timeout(3000);

  var extracted;

  beforeEach(function() {
    this.buf = fs.readFileSync(pdfPath);
    return parse(this.buf).then(function (parsedData) {
      extracted = extract(parsedData);
    })
  });

  it('extracts an array of strings from the PDF', function() {
    expect(extracted).to.be.instanceof(Array);
    expect(extracted).to.have.length.above(0);
  });

  it('does not include any of the Donahue Exit Quota pages', function() {
    expect(extracted.join('')).to.not.contain('Donohue Exit Quota');
  });

  it('does not include non-info strings like First, Last, Previous', function() {
    expect(extracted).to.not.include('First');
    expect(extracted).to.not.include('Last');
    expect(extracted).to.not.include('Previous');
    expect(extracted).to.not.include('Next');
  });
});