import React from "react";
import PropTypes from "prop-types";
import IconItem from "./IconItem";
import IconItemZeroState from "./IconItemZeroState";
import IconItemLoading from "./IconItemLoading";
import IconItemAd from "./IconItemAd";

IconList.propTypes = {
  icons: PropTypes.array.isRequired,
  showMore: PropTypes.bool
};

export default function IconList({ icons, showMore }) {
  let content;

  if (icons.length > 0) {
    // Add the icons
    content = icons.map(function(icon, i) {
      return <IconItem key={icon.id} icon={icon} />;
    });

    // If there's more to show, add a loading <li>
    if (showMore) {
      content.push(<IconItemLoading key="loading" />);
    }
  } else {
    content = <IconItemZeroState />;
  }

  return (
    <ul className="list-icons">
      {content}
    </ul>
  );
}
