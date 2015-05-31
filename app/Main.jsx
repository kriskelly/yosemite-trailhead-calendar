/** @jsx React.DOM */
'use strict'
var React = require('react');
var Calendar = require('./Calendar');
var $ = require('fullcalendar/node_modules/jquery');
var _ = require('lodash-fp');

// Convert list of trailheads w/ dates to calendar events
var calendarEvents = _.flow(
  _.map(function(trailhead) {
    return _.map(function(date) {
      return {
        title: trailhead.name,
        start: date,
        allDay: true
      };
    }, trailhead.dates);  
  }),
  _.flatten
);

module.exports = React.createClass({
  displayName: 'Main',

  getInitialState: function() {
    return {
      trailheads: []
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: '/available-trailheads.json',
      success: function(data) {
        this.setState({trailheads: data});
      },
      context: this
    });
  },

  render: function(){

    return <div><Calendar events={calendarEvents(this.state.trailheads)} /></div>
  }
})