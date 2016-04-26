/** @jsx React.DOM */
'use strict';
var React = require('react')
var Calendar = require('./Calendar.jsx');
var SearchBar = require('./SearchBar.jsx');


module.exports = React.createClass({
  displayName: 'SearchableCalendar',

  getInitialState: function () {
    return {
      searchQuery: ''
    };
  },

  searchEvents: function (searchQuery) {
    this.setState({ searchQuery: searchQuery });
  },

  render: function(){
    return (
      <div>
        <div className="row">
          <SearchBar onSubmitSearch={this.searchEvents} />
        </div>
        <div className="row">
          <Calendar searchQuery={this.state.searchQuery} />
        </div>
      </div>
    );
  }
});