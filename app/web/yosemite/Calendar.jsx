/** @jsx React.DOM */
'use strict';
var React = require('react')
require('fullcalendar');
var $ = require('jquery');
require("fullcalendar/dist/fullcalendar.css");
var _ = require('lodash-fp');
var querystring = require('querystring');

var EVENTS_URL = '/yosemite-calendar-events.json';

module.exports = React.createClass({
  displayName: 'Calendar',

  propTypes: {
    searchQuery: React.PropTypes.string.isRequired
  },

  // getInitialState: function () {
  //   return {
  //     eventSource: null
  //   };
  // },

  componentDidMount: function() {
    this.fetchInitialEvents();
  },

  componentDidUpdate: function (props) {
    this.updateEvents();
  },

  fetchInitialEvents: function () {
    var node = $(React.findDOMNode(this.refs.cal));
    node.fullCalendar({
      events: this.getEventSource()
    });
  },

  getEventSourceData: function () {
    return {
      search: this.props.searchQuery
    };
  },

  getEventSource: function () {
    var baseURL = '/yosemite-calendar-events.json';
    var eventSource = {
      url: baseURL
    };
    if (this.props.searchQuery) {
      eventSource.data = this.getEventSourceData();
    }
    return eventSource;
  },

  updateEvents: function () {
    var node = $(React.findDOMNode(this.refs.cal));
    node.fullCalendar('removeEventSource', EVENTS_URL);
    var eventSource = this.getEventSource();
    node.fullCalendar('addEventSource', this.getEventSource());
  },

  render: function(){
    return (
      <div className="col-md-12">
        <div className="calendar" ref="cal"></div>
      </div>
    );
  }
});