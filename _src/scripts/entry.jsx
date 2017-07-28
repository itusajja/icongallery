import React from "react";
import ReactDOM from "react-dom";
import getJSON from "./utils/getJSON";
import SearchIcons from "./components/SearchIcons";

// If it's the search page
// Load the data & kick off react
getJSON("/shared/api/index.json", function(data) {
  ReactDOM.render(
    <SearchIcons icons={data.icons} site={data.site} threshold={20} />,
    document.getElementById("root")
  );
});
