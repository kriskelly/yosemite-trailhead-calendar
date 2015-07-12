/** @jsx React.DOM */
'use strict';
var React = require('react'),
    TabbedArea = require('react-bootstrap/lib/TabbedArea'),
    TabPane = require('react-bootstrap/lib/TabPane'),
    Yosemite = require('./yosemite/Main');

module.exports = React.createClass({
  render: function(){
    return (
      <TabbedArea defaultActiveKey={1}>
        <TabPane eventKey={1} tab='Yosemite Trailheads'><Yosemite /></TabPane>
      </TabbedArea>
    );
  }
})