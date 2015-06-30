require("babel/register");

var campgroundsUrl = 'http://www.forestcamping.com/dow/pacficsw/eldocmp.htm';

var download = require('../download'),
    parse = require('../parse_html'),
    transform = require('./transform');

module.exports = function() {
  return download(campgroundsUrl).then(parse).then(transform);
};