var scrapePdf = require('../../../../app/scraper/yosemite'),
    expect = require('chai').expect;

// This test downloads the PDF, so skip for most runs.
describe.skip('yosemite scraper', function() {
  this.timeout(3000);

  it('works', function() {
    return scrapePdf().then(function(trailheads) {
      expect(trailheads).to.be.instanceOf(Array);
      expect(trailheads).to.have.length.above(0);
    });
  });
});