import React, { Component } from "react";
import PropTypes from "prop-types";
import debounce from "../utils/debounce";

export default class IconFilters extends Component {
  static propTypes = {
    iconCount: PropTypes.number.isRequired,
    activeFilters: PropTypes.object.isRequired,
    onUserInput: PropTypes.func.isRequired,
    site: PropTypes.object.isRequired
  };

  // Debounce the keyup event
  // http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js/24679479#24679479
  componentWillMount() {
    this.delayedHandleChange = debounce(this.handleChange, 250);
  }

  handleKeyUp = e => {
    e.persist();
    this.delayedHandleChange();
  };

  handleChange = e => {
    this.props.onUserInput({
      category: this.categoryInput.value,
      color: this.colorInput.value,
      search: this.searchInput.value
    });
  };

  render() {
    return (
      <div className="filters">
        <span className="filters__count">
          {this.props.iconCount}
          {this.props.iconCount === 1 ? " icon" : " icons"}
        </span>

        <input
          ref={input => this.searchInput = input}
          onKeyUp={this.handleKeyUp}
          defaultValue={this.props.activeFilters.search}
          type="search"
          placeholder="Search..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        <select
          ref={input => this.categoryInput = input}
          onChange={this.handleChange}
          value={this.props.activeFilters.category}>
          <option value="">All categories...</option>
          {this.props.site.categories.map(function(category, i) {
            return <option key={i} value={category.id}>{category.name}</option>;
          })}
        </select>

        <select
          ref={input => this.colorInput = input}
          onChange={this.handleChange}
          value={this.props.activeFilters.color}>
          <option value="">All colors...</option>
          {this.props.site.colors.map(function(color, i) {
            return <option key={i} value={color.id}>{color.name}</option>;
          })}
        </select>
      </div>
    );
  }
}
