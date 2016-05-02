'use strict';

var _ = require('lodash-fp'),
    util = require('../util'),
    monthToInt = util.monthToInt,
    trailheadList = require('./all_trailheads');

var extractDay = _.parseInt(10);

var TOKEN_TYPES = {
  TRAILHEAD_NAME: 0,
  DATE_LIST: 1,
  MONTH_NAME: 2
};

function parseTrailheads(tokens) {
  var trailheads = [];
  var day, month, currentTrailhead;

  _.each(function (token) {
    var token = tokens.shift();
    var tokenType = getTokenType(token);
    switch(tokenType) {
      case TOKEN_TYPES.TRAILHEAD_NAME: {
        if (!currentTrailhead || currentTrailhead.name !== token) {
          currentTrailhead = { name: token, months: {
            'April': [],
            'May': [],
            'June': [],
            'July': [],
            'August': [],
            'September': [],
            'October': []
          }};
          trailheads.push(currentTrailhead);
        }
        break;
      }
      case TOKEN_TYPES.MONTH_NAME: {
        month = [];
        currentTrailhead.months[token] = month;
        break;
      }
      case TOKEN_TYPES.DATE_LIST: {
        var cleanDateList = _.reject(function (day) { return !day; }, token.split(' '));
        var days = _.map(extractDay, cleanDateList);
        Array.prototype.push.apply(month, days); // Concat in place
        break;
      }
      default: {
        throw "Unknown token type for: " + token;
      }
    }
  }, tokens);

  return trailheads;
}

function getTokenType(token) {
  if (trailheadList.indexOf(token) > -1) {
    return TOKEN_TYPES.TRAILHEAD_NAME;
  } else if (monthToInt(token)) {
    return TOKEN_TYPES.MONTH_NAME;
  } else if (/\d/.test(token[0])) { // Fragile: check if 1st char is a digit
    return TOKEN_TYPES.DATE_LIST;
  }
}

module.exports = parseTrailheads;