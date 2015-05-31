/** @jsx React.DOM */
'use strict'
var React = require('react');
var Calendar = require('./Calendar');

module.exports = React.createClass({
    displayName: 'Main',
    render: function(){
        return <div><Calendar /></div>
    }
})