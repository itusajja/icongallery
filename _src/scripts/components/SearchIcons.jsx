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

    // Setup intial filters
    let activeFilters = {
      category: "",
      color: "",
      search: ""
    };

    // Check to see if params were passed via URL
    // If they were, set the appropriate filter val
    // function getQueryParams(str) {
    //   return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n=n.split("="),this[n[0]]=n[1],this;}.bind({}))[0];
    // };
    // var activeFilters
    let query = location.search.substring(1);
    if (query !== "") {
      query = query.split("=");
      const key = query[0];
      const val = query[1];

      if (key === "category") {
        activeFilters.category = val;
      } else if (key === "color") {
        activeFilters.color = val;
      } else if (key === "search") {
        activeFilters.search = val;
      }
    }

    // Get the icons
    const icons = this.getFilteredIcons(activeFilters);

    // Return the initial state
    this.state = {
      activeFilters: activeFilters,
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

        let now = +new Date(), args = arguments;
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
    const footerHeight = document.getElementById("footer").offsetHeight;
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

  // User input filters
  handleUserInput = activeFilters => {
    const { threshhold } = this.props;
    const icons = this.getFilteredIcons(activeFilters);
    this.setState({
      activeFilters: activeFilters,
      iconCount: icons.length,
      visibleIcons: icons.slice(0, threshold),
      allIcons: icons
    });
  };

  // Return an array of icon objects (filtered if relevant)
  getFilteredIcons = activeFilters => {
    const { icons } = this.props;
    return icons.filter(function(icon) {
      if (activeFilters.category !== "") {
        if (activeFilters.category !== icon.category) {
          return false;
        }
      }

      if (activeFilters.color !== "") {
        if (icon.tags.indexOf(activeFilters.color) === -1) {
          return false;
        }
      }

      if (activeFilters.search !== "") {
        if (icon.title.score(activeFilters.search) < 0.3) {
          return false;
        }
      }

      return true;
    });
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

  render() {
    const { iconCount, activeFilters, visibleIcons, allIcons } = this.state;
    const { site } = this.props;

    return (
      <div>
        <IconFilters
          site={site}
          iconCount={iconCount}
          activeFilters={activeFilters}
          onUserInput={this.handleUserInput}
        />

        <IconList
          icons={visibleIcons}
          showMore={allIcons.length > visibleIcons.length}
        />

        <a href="#" className="scroll-top" onClick={this.handleScrollTop}>
          Top
        </a>
      </div>
    );
  }
}
