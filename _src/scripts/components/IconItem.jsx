import React from "react";
import PropTypes from "prop-types";

IconItem.propTypes = {
  src1x: PropTypes.string.isRequired,
  src2x: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default function IconItem({ src1x, src2x, title, url }) {
  return (
    <li>
      <a href={url} title={title} className="js-trigger-icon-modal">
        <span className="icon-wrapper icon-wrapper--128">
          <img
            alt={`${title} app icon`}
            className="icon icon--128"
            src={src1x}
            srcSet={`${src2x} 2x`}
          />
        </span>
      </a>
    </li>
  );
}
