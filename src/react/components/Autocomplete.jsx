import React, { Component } from "react";
import { arrayOf, string, object, func } from "prop-types";
import debounce from "../utils/debounce";

export default class Autocomplete extends Component {
  static propTypes = {
    dataIds: arrayOf(string).isRequired,
    dataById: object.isRequired,
    filterId: string.isRequired,
    handleChangeActiveFilter: func.isRequired,
    initialInputValue: string
  };

  constructor(props) {
    super(props);
    const { initialInputValue, dataById, dataIds } = props;

    this.state = {
      isOpen: false,
      inputValue: dataById[initialInputValue] || "",
      selectValue: "",
      selectValueOptions: dataIds
    };
  }

  debouncedhandleChangeActiveFilter = debounce(value => {
    const { filterId, handleChangeActiveFilter } = this.props;
    handleChangeActiveFilter(filterId, value);
  }, 250);

  handleInputOnKeyDown = e => {
    const { dataById } = this.props;
    const { inputValue, selectValue, selectValueOptions } = this.state;

    if (e.keyCode === 40 || e.keyCode === 38) {
      const currentPosition = selectValueOptions.indexOf(selectValue);

      // Determine the new position
      let newPosition = currentPosition;

      // If down arrow
      if (e.keyCode === 40) {
        newPosition += 1;
        // If you're at the end of the list, start over
        if (newPosition > selectValueOptions.length - 1) {
          newPosition = 0;
        }
        // otherwise up arrow
      } else {
        newPosition -= 1;
        // If you're at the beginning of the list, start at the end
        if (newPosition < 0) {
          newPosition = selectValueOptions.length - 1;
        }
      }

      const newSelectValue = selectValueOptions[newPosition];
      this.setState({
        inputValue: dataById[newSelectValue] || inputValue,
        isOpen: true,
        selectValue: newSelectValue
      });
      this.debouncedhandleChangeActiveFilter(newSelectValue);
      return;
    }

    // On Enter
    if (e.keyCode === 13) {
      this.setSelectedValue(selectValue);
    }
  };

  handleInputOnChange = e => {
    const { dataIds, dataById, handleChangeActiveFilter } = this.props;
    const value = e.target.value;

    const newSelectValueOptions = value
      ? dataIds.filter(
          id =>
            // indexOf finds any match, lastIndexOf finds only matches starting at
            // beginning of string
            dataById[id].toLowerCase().indexOf(value.toLowerCase(), 0) !== -1
        )
      : dataIds;
    const newSelectValue =
      value && newSelectValueOptions.length ? newSelectValueOptions[0] : "";

    this.setState({
      inputValue: value,
      selectValue: newSelectValue,
      selectValueOptions: newSelectValueOptions,
      isOpen: newSelectValueOptions.length > 0
    });
    this.debouncedhandleChangeActiveFilter(newSelectValue);
  };

  handleInputOnBlur = e => {
    const { dataById } = this.props;
    const { inputValue, selectValue, selectValueOptions } = this.state;

    // Make the select list disappear when you blur the input field
    // Only set `isOpen` if the select field wasn't clicked, i.e. we don't want
    // to hide the dropdown if it was the dropdown that was clicked
    if (e.relatedTarget != this.$select) {
      this.setState({
        isOpen: false,
        // Reset the input value if a valid select value wasn't present when
        // the user blurred the field
        inputValue: selectValue ? dataById[selectValue] : ""
      });
    }
  };

  handleInputOnFocus = () => {
    const { inputValue } = this.state;

    this.setState({ isOpen: true });

    // If there's a value present, auto select it.
    // `setSelectionRange` with a timeout used to make it work on iOS
    if (inputValue) {
      setTimeout(() => {
        this.$input.setSelectionRange(0, 999);
      }, 100);
    }
  };

  handleSelectOnChange = e => {
    this.setSelectedValue(e.target.value);
  };

  handleSelectOnClick = e => {
    // If user clicks on the already active item, close the dropdown
    this.setState({ isOpen: false });
  };

  // When a value is selected from the <select>, store that info
  setSelectedValue = value => {
    const {
      dataById,
      dataIds,
      filterId,
      handleChangeActiveFilter
    } = this.props;
    this.setState({
      inputValue: dataById[value] ? dataById[value] : "",
      selectValueOptions: value ? [value] : dataIds,
      isOpen: false
    });
    handleChangeActiveFilter(filterId, value);
  };

  render() {
    const { activeFilter, dataById, handleChangeActiveFilter } = this.props;
    const { inputValue, isOpen, selectValue, selectValueOptions } = this.state;

    return (
      <div className="filters__control__autocomplete">
        <input
          autoComplete="off"
          id="icon-designers-input"
          name="icon-designers-input"
          onChange={this.handleInputOnChange}
          onBlur={this.handleInputOnBlur}
          onFocus={this.handleInputOnFocus}
          onKeyDown={this.handleInputOnKeyDown}
          placeholder="Choose one..."
          ref={input => {
            this.$input = input;
          }}
          type="text"
          value={inputValue}
        />

        {isOpen && (
          <select
            id="icon-designers-select"
            onChange={this.handleSelectOnChange}
            onClick={this.handleSelectOnClick}
            ref={select => {
              this.$select = select;
            }}
            size={
              selectValueOptions.length > 10
                ? 10
                : selectValueOptions.length + 1
            }
            value={selectValue}
          >
            <option value="" disabled>
              Choose one...
            </option>
            {selectValueOptions.map(option => (
              <option value={option} key={option}>
                {dataById[option]}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
}
