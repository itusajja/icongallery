import React from 'react';
import IconList from './IconList';
import getJSON from '../_utils/getJSON';
import shuffleArray from '../_utils/shuffleArray';

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

  componentDidMount: function(){
    var activeCategoryId = this.props.activeCategoryId,
        activePostName = this.props.activePostName;
    getJSON('/data.json', function(data){
      var icons = data.icons.filter(function(icon){
        return (icon.category === activeCategoryId && icon.title !== activePostName) ? true : false;
      });
      shuffleArray(icons);
      this.setState({
        icons: icons.slice(0, 12)
      });
    }.bind(this));
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