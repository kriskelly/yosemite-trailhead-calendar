/** @jsx React.DOM */
'use strict'

// Bootstrap CSS loaded via Webpack
require('bootstrap/dist/css/bootstrap.css');

var React = require('react');
var Calendar = require('./Calendar');
var Loader = require('./Loader');
var $ = require('jquery');
var _ = require('lodash-fp');
var moment = require('moment');

var today;
var skipOldDates = _.filter(function(date) {
  var momentDate = moment(new Date(date));
  if (!today) {
    today = new Date();
  }
  return momentDate.isAfter(today);
});

var createEvent = _.curry(function(title, date) {
  return {
    title: title,
    start: date,
    allDay: true
  };
});

// Convert list of trailheads w/ dates to calendar events
var calendarEvents = _.flow(
  _.map(function(trailhead) {
    var processDates = _.flow(
      skipOldDates,
      _.map(createEvent(trailhead.name))
    );

    return processDates(trailhead.dates);
  }),
  _.flatten
);

module.exports = React.createClass({
  displayName: 'Main',

  getInitialState: function() {
    return {
      trailheads: [],
      loading: true
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: '/available-trailheads.json',
      success: function(data) {
        this.setState({trailheads: data, loading: false});
      },
      error: function() {
        console.log('an error happened!');
      },
      context: this
    });
  },

  render: function(){
    var display;
    if (!!this.state.loading) {
      display = <Loader />;
    } else {
      display = <Calendar events={calendarEvents(this.state.trailheads)} />;
    }
    return (
      <div>
        {display}
      </div>
    );
  }
})