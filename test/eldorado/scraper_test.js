var scrape = require('../../app/scraper/eldorado'),
    expect = require('chai').expect;

describe('eldorado scraper', function() {
  it('works', function(done) {
    scrape().then(function(campgrounds) {
      expect(campgrounds).to.be.instanceOf(Array);
      expect(campgrounds).to.have.length.above(0);
    }).then(done);
  });
});