import React from 'react';

var IconItemAd = React.createClass({
  propTypes: {
    ad: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <li 
        className="icon-container icon-container--ad" 
        dangerouslySetInnerHTML={{__html: this.props.ad}}>
      </li>
    );
  }
});

module.exports = IconItemAd;
