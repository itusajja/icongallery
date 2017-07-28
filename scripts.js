/**
 * 
 * NOTE: The following code is run on every page of the site
 * 
 */

/**
 * Dropdown controls
 */
var dropdown = document.querySelector(".dropdown__trigger");
dropdown.addEventListener("click", function(e) {
  e.stopPropagation();
  toggleClass(this.parentNode, "dropdown--active");
});
var body = document.getElementsByTagName("body");
body[0].addEventListener("click", function(e) {
  removeClass(dropdown.parentNode, "dropdown--active");
});

/**
 * Retina image replacement
 * FYI: only takes place on 512 icons. We may or may not have the 1024 version
 */
var img512 = document.querySelector("img[data-src2x]");
if (img512) {
  // Get src
  var src1024 = img512.src.replace("/512/", "/1024/");

  // See if image exists
  var img1024 = new Image();
  img1024.onload = function() {
    // image exists, swap out src
    img512.src = src1024;
  };
  img1024.src = src1024;
}

/**
 * General helper functions
 */
function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(
      new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
      " "
    );
  }
}

function toggleClass(el, className) {
  if (!el) {
    return;
  }

  if (el.classList) {
    el.classList.toggle(className);
  } else {
    var classes = el.className.split(" ");
    var existingIndex = classes.indexOf(className);

    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1);
    } else {
      classes.push(className);
      el.className = classes.join(" ");
    }
  }
}
