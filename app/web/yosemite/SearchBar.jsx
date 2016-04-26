/** @jsx React.DOM */
'use strict';
var React = require('react')

module.exports = React.createClass({
  displayName: 'SearchBar',

  propTypes: {
    onSubmitSearch: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      searchTerms: '',
    }
  },

  submitSearch: function (e) {
    e.preventDefault();
    this.props.onSubmitSearch(this.state.searchTerms);
  },
  
  trackSearchTerms: function (e) {
    this.setState({ searchTerms: e.target.value });
  },

  render: function(){
    return (
      <form onSubmit={this.submitSearch}>
        <input type="text" name="searchterms" onChange={this.trackSearchTerms} />
        <input type="submit" value="Search" />
      </form>
    );
  }
});