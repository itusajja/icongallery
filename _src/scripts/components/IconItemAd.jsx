import React from "react";
import PropTypes from "prop-types";

IconItemAd.propTypes = {
  ad: PropTypes.string.isRequired
};

export default function IconItemAd({ ad }) {
  return (
    <li
      className="icon-container icon-container--ad"
      dangerouslySetInnerHTML={{ __html: this.props.ad }}
    />
  );
}
