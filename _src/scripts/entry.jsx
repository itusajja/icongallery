import React from "react";
import ReactDOM from "react-dom";
import SearchIcons from "./components/SearchIcons";

// It's expected that all data comes in the format expected from
// `window.ICON_GALLERY`. So make modifications there as needed.
ReactDOM.render(
  <SearchIcons data={window.ICON_GALLERY} />,
  document.getElementById("root")
);
