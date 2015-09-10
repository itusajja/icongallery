import React from 'react';

var IconFilters = React.createClass({
  propTypes: {
    iconCount: React.PropTypes.number.isRequired,
    activeFilters: React.PropTypes.object.isRequired,
    onUserInput: React.PropTypes.func.isRequired,
    site: React.PropTypes.object.isRequired
  },

  handleChange: function() {
    this.props.onUserInput({
      'category': this.refs.categoryInput.getDOMNode().value,
      'color': this.refs.colorInput.getDOMNode().value,
      'search': this.refs.searchInput.getDOMNode().value
    });
  },

  render: function() {
    return (
      <div className="filters">
        <span className="filters__count">
          {this.props.iconCount} 
          {(this.props.iconCount === 1) ? ' icon' : ' icons'}
        </span>
        
        <input 
          ref="searchInput" 
          onKeyUp={this.handleChange}
          defaultValue={this.props.activeFilters.search} 
          type="search" 
          placeholder="Search..." 
          autoComplete="off" 
          autoCorrect="off" 
          spellCheck="false" 
        />
        
        <select 
          ref="categoryInput" 
          onChange={this.handleChange} 
          value={this.props.activeFilters.category}>
            <option value="">All categories...</option>
            {this.props.site.categories.map(function(category, i){
              return <option key={i} value={category.id}>{category.name}</option>;
            })}
        </select>

        <select 
          ref="colorInput" 
          onChange={this.handleChange}
          value={this.props.activeFilters.color}>
            <option value="">All colors...</option>
            {this.props.site.colors.map(function(color, i){
              return <option key={i} value={color.id}>{color.name}</option>;
            })}
        </select>
      </div>
    );
  }
});

module.exports = IconFilters;