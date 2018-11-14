/**
 *
 * NOTE: The following code will run on every page of the site unless you
 * otherwise tell it not to.
 *
 */

/**
 * Dropdown controls
 */
var dropdown = document.querySelector(".dropdown__trigger");
dropdown.addEventListener("click", function(e) {
  e.stopPropagation();
  this.parentNode.classList.toggle("dropdown--active");
});
var body = document.getElementsByTagName("body");
body[0].addEventListener("click", function(e) {
  dropdown.parentNode.classList.remove("dropdown--active");
});

/**
 *
 * Modal Links
 * Only try doing a modal if it's the home page or a "pagination" page
 *
 */

// if (location.pathname === "/" || location.pathname.substring(0, 3) === "/p/") {
addModalFunctionality();
// }

function addModalFunctionality() {
  /**
   * VARS
   */
  // We keep track of which image is loading, in case user closes modal
  // while the image is still loading we can reset the onload event
  var $modalIconCurrentlyLoading = null;
  // prettier-ignore
  var $modal = createEl(
    '<div class="modal">' +
      '<button class="modal__close">&#215;</button>' +
      '<div class="modal__body"></div>' +
    '</div>'
  );
  var $modalBody = $modal.querySelector(".modal__body");
  var $modalLoader = createEl(
    '<img src="/assets/images/loading.gif" alt="loading" width="32" height="32" />'
  );
  var $modalIcon = createEl(
    '<img width="512" height="512" class="icon icon--512" />'
  );

  /**
   * Modal
   * Add modal to DOM.
   * Add listeners so any click outside of `.modal__body` will close the modal
   */

  $modal.addEventListener("click", function() {
    // Hide the modal
    document.body.classList.remove("show-modal");
    // If there's an icon that's still loading, ny currently loading icon
    if ($modalIconCurrentlyLoading) {
      $modalIconCurrentlyLoading = null;
    }
  });
  $modal.querySelector(".modal__body").addEventListener("click", function(e) {
    e.stopPropagation();
  });
  document.body.appendChild($modal);

  /**
   * Icons
   * Declare a render icon function for when the modal icon loads
   * Add listener to all the icons on the page
   */
  var renderIcon = function($elToAppend) {
    $modalBody.innerHTML = "";
    $modalBody.appendChild($elToAppend);
    $modalIconCurrentlyLoading = null;
    document.body.classList.add("show-modal");
  };

  var $icons = [].slice.call(
    document.querySelectorAll(".js-trigger-icon-modal")
  );
  $icons.forEach(function($icon) {
    $icon.addEventListener("click", function(e) {
      e.preventDefault();

      var $clone = $icon.cloneNode(true);
      $clone.classList.remove("js-trigger-icon-modal");

      // Render the small size

      // Show the modal with a loading indicator until everything loads

      // Then load the big one and replace the small one when done

      var $cloneSpan = $clone.querySelector(".icon-wrapper");
      $cloneSpan.classList.remove("icon-wrapper--128");
      $cloneSpan.classList.add("icon-wrapper--512");

      var $cloneImg = $clone.querySelector("img");
      $cloneImg.classList.remove("icon--128");
      $cloneImg.classList.add("icon--512");
      $cloneImg.setAttribute("width", "512");
      $cloneImg.setAttribute("height", "512");
      $cloneImg.setAttribute("srcset", "");

      renderIcon($clone);
      $cloneImg.style = "opacity: .5";

      var img = new Image();
      img.onload = function() {
        $cloneImg.src = this.src;
        $cloneImg.style = "opacity: 1";
      };
      img.onerror = function() {
        console.log("Failed to fetch.");
        if (this.src.indexOf("/1024.png") > -1) {
          console.log("gonna try fetching 512...");
          img.src = this.src.replace("/1024.png", "/512.png");
        }
      };
      img.src = $cloneImg.getAttribute("src").replace("/128.png", "/1024.png");

      // Listeners for when the icon loads. First try for a 1024 image. If that
      // fails, it's because there's no 1024 size, so get a 512 (which should
      // be guaranteed)
      // $cloneImg.onload = function() {
      //   // renderIcon($clone);
      // };

      // $cloneImg.setAttribute(
      //   "src",
      //   $cloneImg.getAttribute("src").replace("/128.png", "/512.png")
      // );
      // $cloneImg.setAttribute(
      //   "srcset",
      //   $cloneImg.getAttribute("srcset").replace("/256.png", "/1024.png")
      // );

      // Kick it off by trying to load the 1024 version and set our currently
      // loading icon in case we have to cancel
      // $modalIcon.src = $icon
      //   .querySelector("img")
      //   .getAttribute("src")
      //   .replace("/128.png", "/1024.png");
      // $modalIconCurrentlyLoading = $modalIcon;
    });
  });
}

function createEl(str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  return div.firstChild;
}
