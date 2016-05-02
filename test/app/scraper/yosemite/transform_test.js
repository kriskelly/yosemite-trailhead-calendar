var parse = require('../../../../app/scraper/yosemite/parse'),
    transform = require('../../../../app/scraper/yosemite/transform'),
    expect = require('chai').expect,
    fs = require('fs'),
    _ = require('lodash-fp');

var pdfPath = __dirname + '/fixtures/fulltrailheads.pdf';

describe('yosemite transform', function() {
  var trailheads;

  beforeEach(function() {
    this.buf = fs.readFileSync(pdfPath);
    return parse(this.buf).then(transform).then(function (results) {
      trailheads = results;
    })
  });

  it('works on the PDF', function() {
    expect(trailheads).to.be.instanceof(Array);
  });

  it('does not output duplicate trailheads', function() {
    var uniqueNames = _.uniq(_.map(_.property('name'), trailheads));
    expect(uniqueNames.length).to.equal(trailheads.length);
  });

  it('outputs trailheads populated with the available dates', function () {
    var trailhead = trailheads[0];
    expect(trailhead.name).to.equal('Beehive Meadows');
    expect(trailhead.dates.length).to.be.greaterThan(0);
  });

  it('outputs trailhead data for the week of May 16 - 20', function () {
    var trailhead = trailheads[0]; // The PDF has that week free for this trailhead.
    var mayDates = _.filter(function (date) { return _.startsWith('5', date); }, trailhead.dates);
    var expectedDates = [
      '5/16/2016',
      '5/17/2016',
      '5/18/2016',
      '5/19/2016',
      '5/20/2016'
    ];
    _.each(function (date) {
      expect(_.includes(date, mayDates)).to.be.true;
    }, expectedDates);
  });

  it('outputs trailhead data for months that are not listed in the PDF (no full dates for that month', function () {
    var trailhead = trailheads[0]; // The PDF has that week free for this trailhead.
    var juneDates = _.filter(function (date) { return _.startsWith('6', date); }, trailhead.dates);
    expect(juneDates.length).to.be.greaterThan(0);
  });
});