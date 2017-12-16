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
      // "http://iosicongallery.com/logic-remote-171107/"
      //
      // /img/128/logic-remote-2017-11-07.png
      // /img/${size}/${slug}-${date}.png

      // http://localhost:4000/logic-remote-171107/
      let link = document.createElement('a');
      link.href = icon.url;
      
      const path = link.pathname;                  // /logic-remote-20171107/
      const id = path.replace(/\//g, "");          // logic-remote-20171107
      const splitPoint = id.lastIndexOf('-');    
      const slug = id.substr(0, splitPoint);       // logic-remote
      const date = id.substr(splitPoint + 1);      // 20171107
      const year = date.substr(0, 4);              // 2017
      const month = date.substr(4, 2);             // 11
      const day = date.substr(6, 2);               // 07
      const dateISO = `${year}-${month}-${day}`;   // 2017-11-07

      return (
        <IconItem
          key={icon.url}
          title={icon.title}
          url={icon.url}
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

  return (
    <ul className="icon-list">
      {content}
    </ul>
  );
}
