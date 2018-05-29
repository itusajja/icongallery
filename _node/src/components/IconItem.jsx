import React from "react";
import PropTypes from "prop-types";

IconItem.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  src1x: PropTypes.string.isRequired,
  src2x: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default function IconItem({ date, src1x, src2x, name, url }) {
  // Sep 13, 2013
  const modifierClass = date < 20130913 ? "pre-ios7" : "post-ios7";
  return (
    <li>
      <a href={url} title={name} className="js-trigger-icon-modal">
        <span
          className={`icon-wrapper icon-wrapper--128 icon-wrapper--${modifierClass}`}
        >
          <img
            alt={`${name} app icon`}
            className={`icon icon--128 icon--${modifierClass}`}
            src={src1x}
            srcSet={`${src2x} 2x`}
          />
        </span>
      </a>
    </li>
  );
}
