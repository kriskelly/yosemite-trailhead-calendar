let cheerio = require('cheerio'),
    R = require('ramda');

function splitLines(text) {
  return text.split("\n");
}

let trimWhitespace = R.map(x => x.trim());

let textFromSelector = R.curry(function(selector, html) {
  return cheerio.load(html)(selector).text();
});

module.exports = R.curry(function parse(selector, html) {
  return R.pipe(textFromSelector(selector), splitLines, trimWhitespace)(html);
});