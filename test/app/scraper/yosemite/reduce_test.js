var expect = require('chai').expect,
    reduceTrailheads = require('../../../../app/scraper/yosemite/reduce'),
    _ = require('lodash-fp');

describe('yosemite reduce strings to list of trailheads', function() {
  it('combines split trailhead names', function(done) {
    var strs = [
      'Foobar Trail',
      'June',
      '10',
      'Lukens',
      'Lake',
      'July',
      '4'
    ];

    var trailheads = reduceTrailheads(strs);
    expect(trailheads).to.have.length.of(2);
    expect(_.map(_property('name'), trailheads)).to.include('Lukens Lake');
  });
});