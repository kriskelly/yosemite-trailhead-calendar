let parseHTML = require('../app/scraper/parse_html');
let expect = require('chai').expect;

describe('parse HTML', function() {
  beforeEach(function() {
    this.html = "<html><body><ul><li>    Foo</li>\n<li>Bar    </li></ul></body></html>";
  });
  
  it('accepts html and returns a list of strings ', function() {
    var textArray = parseHTML('body', this.html);
    expect(textArray).to.deep.equal(['Foo', 'Bar']);
  });
});