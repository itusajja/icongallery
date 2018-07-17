import React, { Component } from "react";
import { arrayOf, string, bool, object, oneOf } from "prop-types";
import { FILTER_IDS } from "../constants";
import IconItem from "./IconItem";
import IconItemZeroState from "./IconItemZeroState";
import IconItemLoading from "./IconItemLoading";
import IconItemAd from "./IconItemAd";

export default class IconList extends Component {
  static propTypes = {
    activeFilterId: oneOf(FILTER_IDS).isRequired,
    activeFilterValue: string.isRequired,
    iconsById: object.isRequired,
    showMore: bool.isRequired,
    themeId: string.isRequired,
    visibleIconIds: arrayOf(string).isRequired
  };

  render() {
    const {
      activeFilter,
      iconsById,
      showMore,
      themeId,
      visibleIconIds
    } = this.props;

    let content;

    if (visibleIconIds.length > 0) {
      content = visibleIconIds.map(iconId => {
        return (
          <IconItem key={iconId} icon={iconsById[iconId]} themeId={themeId} />
        );
      });

      // If there's more to show, add a loading <li>
      if (showMore) {
        content.push(<IconItemLoading key="loading" />);
      }
    } else {
      content = <IconItemZeroState />;
    }

    return <ul className="icon-list">{content}</ul>;
  }
}
