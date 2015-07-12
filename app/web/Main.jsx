/** @jsx React.DOM */
'use strict';
var React = require('react'),
    TabbedArea = require('react-bootstrap/lib/TabbedArea'),
    TabPane = require('react-bootstrap/lib/TabPane'),
    Eldorado = require('./eldorado/Main'),
    Yosemite = require('./yosemite/Main');

module.exports = React.createClass({
  render: function(){
    return (
      <TabbedArea defaultActiveKey={1}>
        <TabPane eventKey={1} tab='Yosemite Trailheads'><Yosemite /></TabPane>
        <TabPane eventKey={2} tab='Eldorado Campgrounds'><Eldorado /></TabPane>
      </TabbedArea>
    );
  }
})