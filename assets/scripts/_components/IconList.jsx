import React from 'react';
import IconItem from './IconItem';
import IconItemZeroState from './IconItemZeroState';
import IconItemLoading from './IconItemLoading';
import IconItemAd from './IconItemAd';

var IconList = React.createClass({
  propTypes: {
    icons: React.PropTypes.array.isRequired,
    showMore: React.PropTypes.bool,
    ad: React.PropTypes.string
  },

  render: function() {
    var content;
    if(this.props.icons.length > 0) {
      // Add the icons
      content = this.props.icons.map(function(icon, i) {
        return <IconItem key={i} icon={icon} />;
      });
      // If there's more to show, add a loading <li>
      if(this.props.showMore) {
        content.push(<IconItemLoading />);
      }
      // If there's an ad, add it to the front
      if(this.props.ad && this.props.ad.length > 0) {
        content.unshift(<IconItemAd ad={this.props.ad} />);
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