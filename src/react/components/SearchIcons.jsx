import "string_score";
import React, { Component } from "react";
import {
  array,
  arrayOf,
  bool,
  number,
  object,
  objectOf,
  oneOf,
  shape,
  string
} from "prop-types";
import IconList from "./IconList";
import IconFilters from "./IconFilters";
import scrollTo from "../utils/scrollTo";
import {
  FILTER_ID_NAME,
  FILTER_ID_CATEGORY,
  FILTER_ID_COLOR,
  FILTER_ID_DEVELOPER,
  FILTER_ID_DESIGNER,
  FILTER_IDS
} from "../constants";

const THRESHOLD = 20;

export default class SearchIcons extends Component {
  static propTypes = {
    data: shape({
      themeId: oneOf([
        "iosicongallery",
        "macosicongallery",
        "watchosicongallery"
      ]).isRequired,
      categoryIds: arrayOf(string).isRequired,
      categoriesById: object.isRequired,
      colorIds: arrayOf(string).isRequired,
      colorsById: object.isRequired,
      designerIds: arrayOf(string).isRequired,
      designersById: object.isRequired,
      developerIds: arrayOf(string).isRequired,
      developersById: object.isRequired,
      iconIds: arrayOf(string).isRequired,
      iconsById: objectOf(
        shape({
          category: string,
          categoryId: string,
          colorId: string,
          designer: string,
          designerId: string,
          developer: string,
          developerId: string,
          id: string.isRequired,
          isPreIos7: bool,
          permalink: string.isRequired,
          title: string.isRequired
        })
      ).isRequired
    })
  };

  constructor(props) {
    super(props);

    const {
      data: { icons }
    } = props;

    // Setup an initial filter by seeing if a key/value pair was passed via URL
    // If so, set the appropriate filter. Otherwise, default to 'search'
    const [activeFilterId, activeFilterValue] = getInitialFilters();

    // Get the icons
    const filteredIconIds = this.getFilteredIconIds(
      activeFilterId,
      activeFilterValue
    );

    // Return the initial state
    this.state = {
      activeFilterId,
      activeFilterValue,
      filteredIconIds,
      numberOfVisibleFilteredIconIds: THRESHOLD
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

  handleShowMore = e => {
    const { numberOfVisibleFilteredIconIds } = this.state;
    // const sliceBegin = filteredIconIdsVisible.length;
    // const sliceEnd = sliceBegin + THRESHOLD;
    // const newIconIds = filteredIconIds.slice(sliceBegin, sliceEnd);
    this.setState({
      numberOfVisibleFilteredIconIds: numberOfVisibleFilteredIconIds + THRESHOLD
      // filteredIconIdsVisible: filteredIconIdsVisible.concat(newIconIds)
    });
  };

  handleChangeActiveFilter = (newActiveFilterId, newActiveFilterValue) => {
    const {
      data: { icons }
    } = this.props;

    // Save state in URL
    const key = newActiveFilterId;
    const value = window.encodeURIComponent(newActiveFilterValue);
    window.history.replaceState({}, "", `?${key}=${value}`);

    // Get and set the new list of filtered icons
    const newFilteredIconIds = this.getFilteredIconIds(
      newActiveFilterId,
      newActiveFilterValue
    );
    this.setState({
      activeFilterId: newActiveFilterId,
      activeFilterValue: newActiveFilterValue,
      filteredIconIds: newFilteredIconIds,
      numberOfVisibleFilteredIconIds: THRESHOLD
    });
  };

  getFilteredIconIds = (filterId, filterValue) => {
    const {
      data: { iconIds, iconsById, designers, developers }
    } = this.props;

    return filterId && filterValue
      ? iconIds.filter(iconId => {
          if (
            filterId === FILTER_ID_CATEGORY &&
            filterValue === iconsById[iconId].categoryId
          ) {
            return true;
          }

          if (
            filterId === FILTER_ID_COLOR &&
            iconsById[iconId].colorId === filterValue
          ) {
            return true;
          }

          if (
            filterId === FILTER_ID_NAME &&
            iconsById[iconId].title.score(filterValue) >= 0.3
          ) {
            return true;
          }

          if (
            filterId === FILTER_ID_DESIGNER &&
            iconsById[iconId].designerId === filterValue
          ) {
            return true;
          }

          if (
            filterId === FILTER_ID_DEVELOPER &&
            iconsById[iconId].developerId === filterValue
          ) {
            return true;
          }

          return false;
        })
      : iconIds;
  };

  render() {
    const {
      activeFilterId,
      activeFilterValue,
      filteredIconIds,
      numberOfVisibleFilteredIconIds
    } = this.state;
    const { data } = this.props;
    const { iconsById, themeId } = data;

    return (
      <div>
        <IconFilters
          activeFilterId={activeFilterId}
          activeFilterValue={activeFilterValue}
          data={data}
          handleChangeActiveFilter={this.handleChangeActiveFilter}
          iconCount={filteredIconIds.length}
        />

        <IconList
          activeFilterId={activeFilterId}
          activeFilterValue={activeFilterValue}
          iconsById={iconsById}
          showMore={filteredIconIds.length > numberOfVisibleFilteredIconIds}
          themeId={themeId}
          visibleIconIds={filteredIconIds.slice(
            0,
            numberOfVisibleFilteredIconIds
          )}
        />
      </div>
    );
  }
}

/**
 * Get the initial filter (optionally passed in via the URL)
 * @returns {Object[]} - `activeFilterId` and `activeFilterValue`
 */
function getInitialFilters() {
  let activeFilterId = FILTER_ID_NAME;
  let activeFilterValue = "";

  let query = location.search.substring(1);

  if (query) {
    let [id, value] = query.split("=");

    // Adding backwards compatibility here where we used to support the key
    // `search` for what is now the name query. Eventually this can be removed
    // This is the only place we're modifying `id`, so when this is removed, you
    // can remove the `let` keyword above
    if (id === "search") {
      id = FILTER_ID_NAME;
    }

    if (id && FILTER_IDS.indexOf(id) !== -1) {
      activeFilterId = id;
    }
    if (value) {
      // values with spaces have a "+", i.e. "Jim+Nielsen" = "Jim Nielsen"
      activeFilterValue = window.decodeURIComponent(value);
    }
  }

  return [activeFilterId, activeFilterValue];
}
