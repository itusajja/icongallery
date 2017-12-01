import React from "react";
import ReactDOM from "react-dom";
import getJSON from "./utils/getJSON";
import SearchIcons from "./components/SearchIcons";

// If it's the search page, load the data & kick off react
getJSON("/api.json", data => {
  ReactDOM.render(
    <SearchIcons icons={data.icons} site={data.site} threshold={20} />,
    document.getElementById("root")
  );
});
