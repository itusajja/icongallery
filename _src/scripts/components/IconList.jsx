import React from "react";
import PropTypes from "prop-types";
import IconItem from "./IconItem";
import IconItemZeroState from "./IconItemZeroState";
import IconItemLoading from "./IconItemLoading";
import IconItemAd from "./IconItemAd";

IconList.propTypes = {
  activeFilter: PropTypes.object.isRequired,
  icons: PropTypes.array.isRequired,
  showMore: PropTypes.bool
};

export default function IconList({ activeFilter, icons, showMore }) {
  let content;

  if (icons.length > 0) {
    // Add the icons
    content = icons.map(icon =>
      <IconItem
        key={icon.id}
        title={icon.title}
        url={icon.url}
        src1x={`${icon.filepath}/128/${icon.filename}`}
        src2x={`${icon.filepath}/256/${icon.filename}`}
      />
    );

    // If there's more to show, add a loading <li>
    if (showMore) {
      content.push(<IconItemLoading key="loading" />);
    }
  } else {
    content = <IconItemZeroState />;
  }

  return (
    <ul className="icon-list">
      {content}
    </ul>
  );
}
