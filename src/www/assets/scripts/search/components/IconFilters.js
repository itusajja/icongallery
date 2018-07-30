import {
  FILTER_IDS,
  FILTER_ID_CATEGORY,
  FILTER_ID_DESIGNER,
  FILTER_ID_COLOR,
  FILTER_ID_NAME,
  FILTER_ID_DEVELOPER
} from "/assets/scripts/search/constants.js";
import AutoComplete from "/assets/scripts/search/components/AutoComplete.js";
import debounce from "/assets/scripts/search/debounce.js";

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

export default class IconFilters extends React.Component {
  static propTypes = {
    activeFilterId: PropTypes.oneOf(FILTER_IDS).isRequired,
    activeFilterValue: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    handleChangeActiveFilter: PropTypes.func.isRequired,
    iconCount: PropTypes.number.isRequired
  };

  // Debounce the keyup event
  // http://stackoverflow.com/questions/23123138/perform-debounce-in-react-js/24679479#24679479
  handleChangeFilterValueName = debounce(() => {
    const { handleChangeActiveFilter } = this.props;
    handleChangeActiveFilter(FILTER_ID_NAME, this.$nameInput.value);
  }, 250);

  handleChangeFilterId = e => {
    const { handleChangeActiveFilter } = this.props;
    handleChangeActiveFilter(e.target.value, "");
  };

  handleChangeFilterValueColor = e => {
    const { activeFilterValue, handleChangeActiveFilter } = this.props;
    const colorId = e.target.value;

    handleChangeActiveFilter(
      FILTER_ID_COLOR,
      colorId === activeFilterValue ? "" : colorId
    );
  };

  render() {
    const {
      activeFilterId,
      activeFilterValue,
      handleChangeActiveFilter,
      iconCount,
      data: {
        designerIds,
        designersById,
        developerIds,
        developersById,
        colorIds,
        colorsById,
        categoryIds,
        categoriesById
      }
    } = this.props;

    return (
      <div className="filters">
        <div className="filters__radios">
          {FILTER_IDS.map(filterId => (
            <label
              key={filterId}
              className={activeFilterId === filterId ? "active" : ""}
            >
              <input
                type="radio"
                checked={activeFilterId === filterId}
                name="filter"
                value={filterId}
                onChange={this.handleChangeFilterId}
              />
              {capitalize(filterId)}
            </label>
          ))}
        </div>

        <div className="filters__control">
          {activeFilterId === FILTER_ID_DEVELOPER && (
            <AutoComplete
              filterId={FILTER_ID_DEVELOPER}
              handleChangeActiveFilter={handleChangeActiveFilter}
              dataIds={developerIds}
              dataById={developersById}
              initialInputValue={activeFilterValue}
            />
          )}

          {activeFilterId === FILTER_ID_DESIGNER && (
            <AutoComplete
              filterId={FILTER_ID_DESIGNER}
              handleChangeActiveFilter={handleChangeActiveFilter}
              dataIds={designerIds}
              dataById={designersById}
              initialInputValue={activeFilterValue}
            />
          )}

          {activeFilterId === FILTER_ID_CATEGORY && (
            <AutoComplete
              filterId={FILTER_ID_CATEGORY}
              handleChangeActiveFilter={handleChangeActiveFilter}
              dataIds={categoryIds}
              dataById={categoriesById}
              initialInputValue={activeFilterValue}
            />
          )}

          {activeFilterId === FILTER_ID_NAME && (
            <input
              autoComplete="off"
              autoCorrect="off"
              defaultValue={activeFilterValue}
              onChange={this.handleChangeFilterValueName}
              placeholder="Search..."
              ref={input => (this.$nameInput = input)}
              spellCheck="false"
              type="text"
            />
          )}

          {activeFilterId === "color" && (
            <ul className="filters__colors">
              {colorIds.map(colorId => (
                <li key={colorId}>
                  <button
                    title={colorsById[colorId]}
                    onClick={this.handleChangeFilterValueColor}
                    value={colorId}
                    className={colorId === activeFilterValue ? "active" : ""}
                    style={
                      colorId === "multi"
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
                        : { backgroundColor: colorId }
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="filters__control__count">
            {iconCount}
            {iconCount === 1 ? " icon" : " icons"}
          </div>
        </div>
      </div>
    );
  }
}
