var scrapePdf = require('../../app/scraper/yosemite'),
    expect = require('chai').expect;

describe('scraper', function() {
  it('works', function(done) {
    this.timeout(15000); // 15s
    scrapePdf().then(function(pages) {
      expect(pages).to.be.instanceOf(Array);
    }).then(done);
  });
});