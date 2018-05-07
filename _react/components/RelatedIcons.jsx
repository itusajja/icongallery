import React from "react";
import PropTypes from "prop-types";
import IconList from "./IconList";

RelatedIcons.propTypes = {
  icons: PropTypes.array.isRequired,
  activeCategoryName: PropTypes.string.isRequired
};

export default function RelatedIcons({ icons, activeCategoryName }) {
  return (
    <div>
      <h2>
        Related icons in the category “{activeCategoryName}”
      </h2>
      <IconList icons={icons} />
    </div>
  );
}
