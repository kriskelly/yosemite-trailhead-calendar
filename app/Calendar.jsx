/** @jsx React.DOM */
'use strict'
var React = require('react')
var calendar = require('fullcalendar');
var $ = require('jquery');
require("fullcalendar/dist/fullcalendar.css");


module.exports = React.createClass({
  propTypes: {
    events: React.PropTypes.array.isRequired
  },

  displayName: 'Calendar',
  componentDidMount: function() {
    var node = React.findDOMNode(this.refs.cal);
    $(node).fullCalendar({
      events: this.props.events
    });
  },

  render: function(){
    return <div ref="cal"></div>
  }
})