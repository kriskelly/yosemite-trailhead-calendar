/** @jsx React.DOM */
'use strict';
var React = require('react')
require('fullcalendar');
var $ = require('jquery');
require("fullcalendar/dist/fullcalendar.css");
var _ = require('lodash-fp');

module.exports = React.createClass({
  displayName: 'Calendar',

  componentDidMount: function() {
    this.updateEvents();
  },

  updateEvents: function () {
    var node = $(React.findDOMNode(this.refs.cal));
    node.fullCalendar({
      events: {
        url: '/yosemite-calendar-events.json'
      }
    });
  },

  render: function(){
    return (
      <div>
        <div className="calendar" ref="cal"></div>
      </div>
    );
  }
});