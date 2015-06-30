var cheerio = require('cheerio');

module.exports = function parse(html) {
  return cheerio.load(html);
};