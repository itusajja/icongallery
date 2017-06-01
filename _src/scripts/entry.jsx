import React from "react";
import ReactDOM from "react-dom";
import getJSON from "./utils/getJSON";
import shuffleArray from "./utils/shuffleArray";
import { removeClass, toggleClass } from "./utils/classNames";
import SearchIcons from "./components/SearchIcons";
import RelatedIcons from "./components/RelatedIcons";

// If it's the home page
if (location.pathname === "/") {
  // Do nothing for now...
} else if (location.pathname.indexOf("/20") === 0) {
  // If it's a blog post page
  // (these all start with `/20` because it's `/:year/:postname` pattern)
  // Get the page's info we need to render related icons
  const el = document.getElementById("related-icons"),
    activePostName = el.getAttribute("data-post-name"),
    activeCategoryId = el.getAttribute("data-category-id"),
    activeCategoryName = el.getAttribute("data-category-name");

  getJSON("/shared/api/index.json", data => {
    // Remove the current page's icon from the list of 'related icons'
    const icons = data.icons.filter(
      icon =>
        icon.category === activeCategoryId && icon.title !== activePostName
          ? true
          : false
    );

    ReactDOM.render(
      <RelatedIcons
        icons={shuffleArray(icons).slice(0, 12)}
        activeCategoryName={activeCategoryName}
      />,
      el
    );
  });
} else if (location.pathname.indexOf("/search") === 0) {
  // If it's the search page
  // Load the data & kick off react
  getJSON("/shared/api/index.json", function(data) {
    ReactDOM.render(
      <SearchIcons icons={data.icons} site={data.site} threshold={20} />,
      document.getElementById("search-container")
    );
  });
}

// Run this on every page
// It controls the dropdown in the header
var dropdown = document.querySelector(".dropdown__trigger");
dropdown.addEventListener("click", function(e) {
  e.stopPropagation();
  toggleClass(this.parentNode, "dropdown--active");
});
var body = document.getElementsByTagName("body");
body[0].addEventListener("click", function(e) {
  removeClass(dropdown.parentNode, "dropdown--active");
});

/*!
 * Retina.js v1.3.0
 *
 * Copyright 2014 Imulus, LLC
 * Released under the MIT license
 *
 * Retina.js is an open source script that makes it easy to serve
 * high-resolution images to devices with retina displays.
 */
(function() {
  // var root = (typeof exports === 'undefined' ? window : exports);
  var root = window;
  var config = {
    // An option to choose a suffix for 2x images
    // retinaImageSuffix : '@2x',

    // Ensure Content-Type is an image before trying to load @2x image
    // https://github.com/imulus/retinajs/pull/45)
    check_mime_type: true,

    // Resize high-resolution images to original image's pixel dimensions
    // https://github.com/imulus/retinajs/issues/8
    force_original_dimensions: true
  };

  function Retina() {}

  root.Retina = Retina;

  Retina.configure = function(options) {
    if (options === null) {
      options = {};
    }

    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        config[prop] = options[prop];
      }
    }
  };

  Retina.init = function(context) {
    if (context === null) {
      context = root;
    }

    var existing_onload = context.onload || function() {};

    context.onload = function() {
      var images = document.querySelectorAll("img[data-at2x]"),
        imagesLength = images.length,
        retinaImages = [],
        i,
        image;
      for (i = 0; i < imagesLength; i += 1) {
        image = images[i];
        if (!!!image.getAttributeNode("data-no-retina")) {
          if (image.src) {
            retinaImages.push(new RetinaImage(image));
          }
        }
      }
      existing_onload();
    };
  };

  Retina.isRetina = function() {
    var mediaQuery =
      "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";

    if (root.devicePixelRatio > 1) {
      return true;
    }

    if (root.matchMedia && root.matchMedia(mediaQuery).matches) {
      return true;
    }

    return false;
  };

  var regexMatch = /\.\w+$/;
  function suffixReplace(match) {
    return config.retinaImageSuffix + match;
  }

  function RetinaImagePath(path, at_2x_path) {
    this.path = path || "";
    if (typeof at_2x_path !== "undefined" && at_2x_path !== null) {
      this.at_2x_path = at_2x_path;
      this.perform_check = true; // Originally false
    } else {
      if (undefined !== document.createElement) {
        var locationObject = document.createElement("a");
        locationObject.href = this.path;
        locationObject.pathname = locationObject.pathname.replace(
          regexMatch,
          suffixReplace
        );
        this.at_2x_path = locationObject.href;
      } else {
        var parts = this.path.split("?");
        parts[0] = parts[0].replace(regexMatch, suffixReplace);
        this.at_2x_path = parts.join("?");
      }
      this.perform_check = true;
    }
  }

  root.RetinaImagePath = RetinaImagePath;

  RetinaImagePath.confirmed_paths = [];

  RetinaImagePath.prototype.is_external = function() {
    return !!(this.path.match(/^https?\:/i) &&
      !this.path.match("//" + document.domain));
  };

  RetinaImagePath.prototype.check_2x_variant = function(callback) {
    var http, that = this;
    if (
      !this.perform_check &&
      typeof this.at_2x_path !== "undefined" &&
      this.at_2x_path !== null
    ) {
      return callback(true);
    } else if (this.at_2x_path in RetinaImagePath.confirmed_paths) {
      return callback(true);
    } else if (this.is_external()) {
      return callback(false);
    } else {
      http = new XMLHttpRequest();
      http.open("HEAD", this.at_2x_path);
      http.onreadystatechange = function() {
        if (http.readyState !== 4) {
          return callback(false);
        }

        if (http.status >= 200 && http.status <= 399) {
          if (config.check_mime_type) {
            var type = http.getResponseHeader("Content-Type");
            if (type === null || !type.match(/^image/i)) {
              return callback(false);
            }
          }

          RetinaImagePath.confirmed_paths.push(that.at_2x_path);
          return callback(true);
        } else {
          return callback(false);
        }
      };
      http.send();
    }
  };

  function RetinaImage(el) {
    this.el = el;
    this.path = new RetinaImagePath(
      this.el.getAttribute("src"),
      this.el.getAttribute("data-at2x")
    );
    var that = this;
    this.path.check_2x_variant(function(hasVariant) {
      if (hasVariant) {
        that.swap();
      }
    });
  }

  root.RetinaImage = RetinaImage;

  RetinaImage.prototype.swap = function(path) {
    if (typeof path === "undefined") {
      path = this.path.at_2x_path;
    }

    var that = this;
    function load() {
      if (!that.el.complete) {
        setTimeout(load, 5);
      } else {
        if (config.force_original_dimensions) {
          if (that.el.offsetWidth == 0 && that.el.offsetHeight == 0) {
            that.el.setAttribute("width", that.el.naturalWidth);
            that.el.setAttribute("height", that.el.naturalHeight);
          } else {
            that.el.setAttribute("width", that.el.offsetWidth);
            that.el.setAttribute("height", that.el.offsetHeight);
          }
        }

        that.el.setAttribute("src", path);
      }
    }
    load();
  };

  if (Retina.isRetina()) {
    Retina.init(root);
  }
})();
