import React from 'react'
import IconList from './IconList'

const RelatedIcons = React.createClass({

  propTypes: {
    icons: React.PropTypes.array.isRequired,
    activeCategoryName: React.PropTypes.string.isRequired
  },

  render: function() {
    const { icons, activeCategoryName } = this.props

    return (
      <div>
        <h2>
          Related icons in the category “{activeCategoryName}”
        </h2>
        <IconList icons={icons} />
      </div>
    );
  }
});

module.exports = RelatedIcons;
