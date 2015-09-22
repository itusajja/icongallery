import React from 'react';
import IconList from './IconList';
import getJSON from '../utils/getJSON';
import shuffleArray from '../utils/shuffleArray';

var RelatedIcons = React.createClass({

  propTypes: {
    icons: React.PropTypes.array.isRequired,
    activeCategoryName: React.PropTypes.string.isRequired,
    activeCategoryId: React.PropTypes.string.isRequired,
    activePostName: React.PropTypes.string.isRequired
  },

  getInitialState: function(){
    return { icons: this.props.icons };
  },

  render: function() {
    return (
      <div>
        <h2>
          Related Icons in the category “{this.props.activeCategoryName}”
        </h2>
        <IconList
          icons={this.state.icons}
        />
      </div>
    );
  }
});

module.exports = RelatedIcons;
