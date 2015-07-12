var React = require('react');

require('../../../assets/loader.css');

module.exports = React.createClass({
  displayName: 'Loader',

  render: function() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-2 col-lg-offset-5'>
            <img src='ajax-loader.gif' className='loader' />
          </div>
        </div>
      </div>
    );      
  }
});