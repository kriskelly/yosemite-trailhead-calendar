/** @jsx React.DOM */
'use strict'
var React = require('react')
var calendar = require('fullcalendar/dist/fullcalendar');
var $ = require('fullcalendar/node_modules/jquery');
require("fullcalendar/dist/fullcalendar.css");


module.exports = React.createClass({
    displayName: 'Calendar',
    componentDidMount: function() {
      var node = React.findDOMNode(this.refs.cal);
      $(node).fullCalendar();
    },

    render: function(){
        return <div ref="cal"></div>
    }
})