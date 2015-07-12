/** @jsx React.DOM */
'use strict';
var React = require('react'),
    Table = require('reactable').Table;

module.exports = React.createClass({

  getDefaultProps: function() {
    return {
      columns: [
        {key: 'name', label: 'Name'},
        {key: 'takesReservations', label: 'Reservable'},
        {key: 'siteCount', label: '# Sites'},
        {key: 'elevation', label: 'Elevation (ft)'},
        {key: 'cost', label: 'Cost per day'},
      ]
    }
  },

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
    return <Table className='table'
                  columns={this.props.columns}
                  data={this.state.campgrounds}
                  sortable={true} />;
  }
})