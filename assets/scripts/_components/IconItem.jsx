import React from 'react';

var IconItem = React.createClass({
  propTypes: {
    icon: React.PropTypes.object.isRequired
  },

  render: function() {
    var url = this.props.icon.url,
        title = this.props.icon.title,
        src = this.props.icon.src,
        src2x = this.props.icon.src2x;
    return (
      <li>
        <a href={url} className="icon-container" title={title}>
          <img
            alt={title + ' app icon'}
            className="icon icon-128"
            src={src}
            data-at2x={src2x}
          />
        </a>    
      </li>
    );
  }
});

module.exports = IconItem;