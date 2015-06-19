var scrapePdf = require('../../app/scraper/yosemite'),
    expect = require('chai').expect;

describe('scraper', function() {
  it('works', function(done) {
    scrapePdf().then(function(trailheads) {
      expect(trailheads).to.be.instanceOf(Array);
      expect(trailheads).to.have.length.above(0);
    }).then(done);
  });
});