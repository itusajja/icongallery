import { FILTER_IDS } from "/assets/scripts/search/constants.js";
import IconListItem from "/assets/scripts/search/components/IconListItem.js";

export default class IconList extends React.Component {
  static propTypes = {
    activeFilterId: PropTypes.oneOf(FILTER_IDS).isRequired,
    activeFilterValue: PropTypes.string.isRequired,
    iconsById: PropTypes.object.isRequired,
    showMore: PropTypes.bool.isRequired,
    themeId: PropTypes.string.isRequired,
    visibleIconIds: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  render() {
    const {
      activeFilter,
      iconsById,
      showMore,
      themeId,
      visibleIconIds
    } = this.props;

    return (
      <React.Fragment>
        {visibleIconIds.length > 0 ? (
          <ul className="icon-list">
            {visibleIconIds.map(iconId => (
              <IconListItem
                key={iconId}
                icon={iconsById[iconId]}
                themeId={themeId}
              />
            ))}
          </ul>
        ) : (
          <p className="filters-zero-state">
            No icons. Try changing your filters.
          </p>
        )}
        {showMore && (
          <p className="filters-loading-more">
            <img
              src="/assets/images/loading.gif"
              alt="Loading"
              width="24"
              height="24"
              style={{ marginRight: "5px" }}
            />
            Loading...
          </p>
        )}
      </React.Fragment>
    );
  }
}
