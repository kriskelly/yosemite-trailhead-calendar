var scrapePdf = require('../../app/scraper/yosemite'),
    expect = require('chai').expect;

describe('scraper', function() {
  it('works', function(done) {
    scrapePdf().then(function(pages) {
      expect(pages).to.be.instanceOf(Array);
    }).then(done);
  });
});