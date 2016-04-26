/** @jsx React.DOM */
'use strict';

// Bootswatch Flatly CSS loaded via Webpack
require('../../../assets/css/bootstrap.css');

var React = require('react');
var Loader = require('./Loader');
var SearchableCalendar = require('./SearchableCalendar');

module.exports = React.createClass({

  render: function(){
    return (
      <div className="container">
        <SearchableCalendar />
      </div>
    );
  }
})