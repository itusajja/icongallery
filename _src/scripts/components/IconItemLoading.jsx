import React from 'react';

var IconItemLoading = React.createClass({
  render: function() {
    return (
      <li className="list-icons__loading">
        <img src="/shared/img/loading.gif" alt="Loading" /> 
        Loading...
      </li>
    );
  }
});

module.exports = IconItemLoading;
