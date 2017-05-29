import React from 'react';
import IconItem from './IconItem';
import IconItemZeroState from './IconItemZeroState';
import IconItemLoading from './IconItemLoading';
import IconItemAd from './IconItemAd';

var IconList = React.createClass({
  propTypes: {
    icons: React.PropTypes.array.isRequired,
    showMore: React.PropTypes.bool
  },

  render: function() {
    var content;
    if(this.props.icons.length > 0) {
      // Add the icons
      content = this.props.icons.map(function(icon, i) {
        return <IconItem key={icon.id} icon={icon} />;
      });
      // If there's more to show, add a loading <li>
      if(this.props.showMore) {
        content.push(<IconItemLoading key='loading' />);
      }
    } else {
      content = <IconItemZeroState />;
    }

    return (
      <ul className="list-icons">
        {content}
      </ul>
    );
  }
});

module.exports = IconList;
