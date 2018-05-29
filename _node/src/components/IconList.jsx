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
    visibleIconIds: arrayOf(string).isRequired
  };

  render() {
    const { activeFilter, iconsById, showMore, visibleIconIds } = this.props;

    let content;

    if (visibleIconIds.length > 0) {
      content = visibleIconIds.map(iconId => {
        // Add the icons
        // Slug and year are derived from the url, i.e.
        // "http://iosicongallery.com/logic-remote-171107/"
        //
        // /img/128/logic-remote-2017-11-07.png
        // /img/${size}/${slug}-${date}.png

        // prettier-ignore
        const id = iconId,                         // logic-remote-20171107
              splitPoint = id.lastIndexOf('-'),
              slug = id.substr(0, splitPoint),     // logic-remote
              date = id.substr(splitPoint + 1),    // 20171107
              year = date.substr(0, 4),            // 2017
              month = date.substr(4, 2),           // 11
              day = date.substr(6, 2),             // 07
              dateISO = `${year}-${month}-${day}`; // 2017-11-07

        return (
          <IconItem
            key={id}
            date={Number(date)} // 20171107
            name={iconsById[iconId].name}
            url={`/${id}/`}
            src1x={`/img/128/${slug}-${dateISO}.png`}
            src2x={`/img/256/${slug}-${dateISO}.png`}
          />
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
