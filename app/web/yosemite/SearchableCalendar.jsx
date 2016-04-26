/** @jsx React.DOM */
'use strict';
var React = require('react')
var Calendar = require('./Calendar.jsx');
var SearchBar = require('./SearchBar.jsx');


module.exports = React.createClass({
  displayName: 'SearchableCalendar',

  render: function(){
    return (
      <Calendar />
    );
  }
});