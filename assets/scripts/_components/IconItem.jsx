import React from 'react';

var IconItem = React.createClass({
  propTypes: {
    icon: React.PropTypes.object.isRequired
  },

  render: function() {
    var url = this.props.icon.url,
        title = this.props.icon.title,
        filepath = this.props.icon.filepath,
        filename = this.props.icon.filename;
    return (
      <li>
        <a href={url} className="icon-container" title={title}>
          <img
            alt={title + ' app icon'}
            className="icon icon-128"
            src={filepath + '/128/' + filename}
            data-at2x={filepath + '/256/' + filename}
          />
        </a>    
      </li>
    );
  }
});

module.exports = IconItem;