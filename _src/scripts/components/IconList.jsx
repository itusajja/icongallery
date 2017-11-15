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
    content = icons.map(icon => {
      // Add the icons
      // Slug and year are derived from the url, i.e. 
      // "http://iosicongallery.com/2017/super-mario-run"
      //
      // /img/128/super-mario-run-2017.png
      // /img/${size}/${slug}-${year}.png
      const urlPieces = icon.url.split('/');
      const slug = urlPieces.pop();
      const year = urlPieces.pop();
      return (
        <IconItem
          key={icon.url}
          title={icon.title}
          url={icon.url}
          src1x={`/img/128/${slug}-${year}.png`}
          src2x={`/img/256/${slug}-${year}.png`}
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

  return (
    <ul className="icon-list">
      {content}
    </ul>
  );
}
