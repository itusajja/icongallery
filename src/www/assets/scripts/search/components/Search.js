import IconList from "/assets/scripts/search/components/IconList.js";
import IconFilters from "/assets/scripts/search/components/IconFilters.js";
import {
  FILTER_ID_NAME,
  FILTER_ID_CATEGORY,
  FILTER_ID_COLOR,
  FILTER_ID_DEVELOPER,
  FILTER_ID_DESIGNER,
  FILTER_IDS
} from "/assets/scripts/search/constants.js";

const THRESHOLD = 20;

export default class SearchIcons extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      themeId: PropTypes.oneOf(["ios", "macos", "watchos"]).isRequired,
      categoryIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      categoriesById: PropTypes.object.isRequired,
      colorIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      colorsById: PropTypes.object.isRequired,
      designerIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      designersById: PropTypes.object.isRequired,
      developerIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      developersById: PropTypes.object.isRequired,
      iconIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      iconsById: PropTypes.objectOf(
        PropTypes.shape({
          category: PropTypes.string,
          categoryId: PropTypes.string,
          colorId: PropTypes.string,
          designer: PropTypes.string,
          designerId: PropTypes.string,
          developer: PropTypes.string,
          developerId: PropTypes.string,
          id: PropTypes.string.isRequired,
          isPreIos7: PropTypes.bool,
          permalink: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
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
    // Trigger it on component mount in case we have a tall screen
    window.onscroll();
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
