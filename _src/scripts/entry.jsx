import React from "react";
import ReactDOM from "react-dom";
import SearchIcons from "./components/SearchIcons";

ReactDOM.render(
  <SearchIcons
    icons={window.ICON_GALLERY.icons}
    site={window.ICON_GALLERY.site}
    threshold={20}
  />,
  document.getElementById("root")
);
