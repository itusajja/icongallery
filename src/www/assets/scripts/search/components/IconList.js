import { FILTER_IDS } from "/assets/scripts/search/constants.js";
import IconItem from "/assets/scripts/search/components/IconItem.js";
import IconItemZeroState from "/assets/scripts/search/components/IconItemZeroState.js";
import IconItemLoading from "/assets/scripts/search/components/IconItemLoading.js";

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
      <ul className="icon-list">
        {visibleIconIds.length > 0 ? (
          <React.Fragment>
            {visibleIconIds.map(iconId => (
              <IconItem
                key={iconId}
                icon={iconsById[iconId]}
                themeId={themeId}
              />
            ))}
            {showMore && <IconItemLoading key="loading" />}
          </React.Fragment>
        ) : (
          <IconItemZeroState />
        )}
      </ul>
    );
  }
}
