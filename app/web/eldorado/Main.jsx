/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      campgrounds: [],
      loading: true
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: '/eldorado-campgrounds.json',
      success: function(data) {
        this.setState({campgrounds: data, loading: false});
      },
      error: function() {
        console.log('an error happened!');
      },
      context: this
    });
  },

  render: function(){
    return <div>{this.state.campgrounds}</div>;
  }
})