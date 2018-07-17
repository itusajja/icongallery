import React from "react";
import { bool, shape, string } from "prop-types";

IconItem.propTypes = {
  icon: shape({
    isPreIos7: bool,
    permalink: string.isRequired,
    title: string.isRequired
  }),
  themeId: string.isRequired
};

export default function IconItem({ icon, themeId }) {
  const { isPreIos7, permalink, title } = icon;

  const iconWrapperClasses = [
    "icon-wrapper",
    "icon-wrapper--128",
    themeId === "iosicongallery"
      ? "icon-wrapper--" + (isPreIos7 ? "pre-ios7" : "post-ios7")
      : ""
  ].join(" ");

  const iconClasses = [
    "icon",
    "icon--128",
    themeId === "iosicongallery"
      ? "icon--" + (isPreIos7 ? "pre-ios7" : "post-ios7")
      : ""
  ].join(" ");

  return (
    <li>
      <a href={permalink} title={title} className="js-trigger-icon-modal">
        <span className={iconWrapperClasses}>
          <img
            alt={`${icon.title} app icon`}
            className={iconClasses}
            src={permalink + "128.png"}
            srcSet={permalink + "256.png 2x"}
          />
        </span>
      </a>
    </li>
  );
}
