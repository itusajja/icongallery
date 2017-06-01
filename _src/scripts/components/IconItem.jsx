import React from "react";
import PropTypes from "prop-types";

IconItem.propTypes = {
  icon: PropTypes.object.isRequired
};

export default function IconItem({ icon }) {
  const { url, title, filepath, filename } = icon;

  return (
    <li>
      <a href={url} className="icon-container" title={title}>
        <img
          alt={`${title} app icon`}
          className="icon icon-128"
          src={`${filepath}/128/${filename}`}
          srcSet={`${filepath}/256/${filename} 2x`}
        />
      </a>
    </li>
  );
}
