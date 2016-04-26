/** @jsx React.DOM */
'use strict';

// Bootstrap CSS loaded via Webpack
require('bootstrap/dist/css/bootstrap.css');

var React = require('react');
var Loader = require('./Loader');
var SearchableCalendar = require('./SearchableCalendar');

module.exports = React.createClass({

  render: function(){
    return (
      <SearchableCalendar />
    );
  }
})