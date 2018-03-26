import React, { Component } from "react";
import PropTypes from "prop-types";
import debounce from "../utils/debounce";

export default class IconFilters extends Component {
  static propTypes = {
    activeFilter: PropTypes.shape({
      type: PropTypes.oneOf(["category", "search", "color", ""]),
      value: PropTypes.string.isRequired
    }),
    handleChangeActiveFilter: PropTypes.func.isRequired,
    iconCount: PropTypes.number.isRequired,
    site: PropTypes.object.isRequired
  };

  // Debounce the keyup event
  // http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js/24679479#24679479
  componentWillMount() {
    this.delayedHandleOnChange = debounce(
      this.handleOnChangeSearchDelayed,
      250
    );
  }

  handleOnChange = e => {
    e.persist();
    this.delayedHandleOnChange();
  };

  handleOnChangeSearchDelayed = e => {
    const { handleChangeActiveFilter } = this.props;
    handleChangeActiveFilter("search", this.searchInput.value);
  };

  render() {
    const {
      activeFilter,
      handleChangeActiveFilter,
      iconCount,
      site: { colors, categories }
    } = this.props;

    return (
      <div className="filters">
        <span className="filters__count">
          {iconCount}
          {iconCount === 1 ? " icon" : " icons"}
        </span>

        <div className="filters__radios">
          <strong>Filter apps by:</strong>
          {["search", "category", "color"].map(filterType =>
            <label key={filterType}>
              <input
                type="radio"
                checked={activeFilter.type === filterType}
                name="filter"
                onChange={() => handleChangeActiveFilter(filterType, "")}
              />
              {filterType === "search" ? "Name" : ""}
              {filterType === "category" ? "Category" : ""}
              {filterType === "color" ? "Icon Color" : ""}
            </label>
          )}
        </div>

        <div className="filters__control">
          {activeFilter.type === "search" &&
            <input
              ref={input => (this.searchInput = input)}
              onChange={this.handleOnChange}
              defaultValue={activeFilter.value}
              type="text"
              placeholder="i.e. “Tweetbot”"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />}

          {activeFilter.type === "color" &&
            <ul className="filters__colors">
              {colors.map(color =>
                <li key={color.id}>
                  <button
                    id={color.id}
                    title={color.name}
                    onClick={() =>
                      handleChangeActiveFilter(
                        "color",
                        color.id === activeFilter.value ? "" : color.id
                      )}
                    style={
                      color.id === "multi"
                        ? {
                            backgroundImage: `linear-gradient(
                            45deg,
                            #ff0000 0%,
                            #ffff00 17%,
                            #00ff00 33%,
                            #00ffff 50%,
                            #0000ff 67%,
                            #ff00ff 83%,
                            #ff0000 100%
                          )`
                          }
                        : { backgroundColor: color.name }
                    }
                    className={color.id === activeFilter.value ? "active" : ""}
                  />
                </li>
              )}
            </ul>}

          {activeFilter.type === "category" &&
            <select
              ref={input => (this.categoryInput = input)}
              onChange={e =>
                handleChangeActiveFilter("category", e.target.value)}
              value={activeFilter.value}>
              <option value="">All categories...</option>
              {categories.map(category =>
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              )}
            </select>}
        </div>
      </div>
    );
  }
}
