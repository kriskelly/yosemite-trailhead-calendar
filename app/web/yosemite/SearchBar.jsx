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
      <div className="col-md-12 search-bar navbar-form">
        <form className="form-inline" onSubmit={this.submitSearch}>
          <div className="form-group">
            <input type="text"
                   className="form-control"
                   name="searchterms"
                   onChange={this.trackSearchTerms}
                   placeholder="Trailhead name..."
            />
          </div>
          <button type="submit" value="Search" className="btn btn-primary"><span className="glyphicon glyphicon-search"></span></button>
        </form>
      </div>
    );
  }
});