import React, { Component } from "react";
import PropTypes from "prop-types";
import IconList from "./IconList";
import IconFilters from "./IconFilters";
import "string_score";
import scrollTo from "../utils/scrollTo";

export default class SearchIcons extends Component {
  static propTypes = {
    icons: PropTypes.array.isRequired,
    site: PropTypes.object.isRequired,
    threshold: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    const { threshold } = this.props;

    // Default to 'search'
    let activeFilter = { type: "search", value: "" };

    // Setup initial filters by checking to see if params were passed via URL
    // If they were, set the appropriate filter
    function getQueryParams(str) {
      return (str || document.location.search)
        .replace(/(^\?)/, "")
        .split("&")
        .map(
          function(n) {
            return (n = n.split("=")), (this[n[0]] = n[1]), this;
          }.bind({})
        )[0];
    }
    let query = location.search.substring(1);
    if (query !== "") {
      query = query.split("=");
      const type = query[0];
      const value = query[1];
      activeFilter = { type, value };
    }

    // Get the icons
    const icons = this.getFilteredIcons(activeFilter);

    // Return the initial state
    this.state = {
      activeFilter,
      iconCount: icons.length,
      visibleIcons: icons.slice(0, threshold),
      allIcons: icons
    };
  }

  componentDidMount() {
    // Handle scroll event for infinite scroll at bottom of page
    let throttle = function(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      let last, deferTimer;
      return function() {
        let context = scope || this;

        let now = +new Date(),
          args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function() {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    };
    const footerHeight = 0; // document.getElementById("footer").offsetHeight;
    window.onscroll = throttle(
      function() {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - footerHeight
        ) {
          this.handleShowMore();
        }
      },
      150,
      this
    );
  }

  // Scroll to top button
  // http://stackoverflow.com/questions/4034659/is-it-possible-to-animate-scrolltop-with-jquery
  handleScrollTop = e => {
    e.preventDefault();
    scrollTo(document.body, 0, 500);
  };

  // Return an array of icon objects (filtered if relevant)
  getFilteredIcons = activeFilter => {
    const { icons } = this.props;
    return activeFilter.value
      ? icons.filter(function(icon) {
          if (
            activeFilter.type === "category" &&
            activeFilter.value === icon.category
          ) {
            return true;
          }

          if (
            activeFilter.type === "color" &&
            icon.tags.indexOf(activeFilter.value) !== -1
          ) {
            return true;
          }

          if (
            activeFilter.type === "search" &&
            icon.title.score(activeFilter.value) >= 0.3
          ) {
            return true;
          }

          return false;
        })
      : icons;
  };

  handleShowMore = e => {
    const { visibleIcons, allIcons } = this.state;
    const { threshold } = this.props;

    const sliceBegin = visibleIcons.length;
    const sliceEnd = sliceBegin + threshold;
    const newIcons = allIcons.slice(sliceBegin, sliceEnd);
    this.setState({
      visibleIcons: visibleIcons.concat(newIcons)
    });
  };

  handleChangeActiveFilter = (type, value) => {
    const { threshold } = this.props;
    const newActiveFilter = { type, value };
    const icons = this.getFilteredIcons(newActiveFilter);

    // Save state in URL
    window.history.replaceState({}, "", `?${type}=${value}`);

    this.setState({
      activeFilter: newActiveFilter,
      iconCount: icons.length,
      visibleIcons: icons.slice(0, threshold),
      allIcons: icons
    });
  };

  render() {
    const { activeFilter, iconCount, visibleIcons, allIcons } = this.state;
    const { site } = this.props;

    return (
      <div>
        <IconFilters
          handleChangeActiveFilter={this.handleChangeActiveFilter}
          activeFilter={activeFilter}
          site={site}
          iconCount={iconCount}
        />

        <IconList
          activeFilter={activeFilter}
          icons={visibleIcons}
          showMore={allIcons.length > visibleIcons.length}
        />
      </div>
    );
  }
}
