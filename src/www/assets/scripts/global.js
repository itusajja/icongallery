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

if (location.pathname === "/" || location.pathname.substring(0, 3) === "/p/") {
  addModalFunctionality();
}

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
    '<img src="/shared/static/img/loading.gif" alt="loading" width="32" height="32" />'
  );
  var $modalIcon = createEl('<img width="512" height="512" class="icon" />');

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

  document.addEventListener("click", e => {
    const activeEl = document.querySelector(".active");
    console.log(activeEl);
    activeEl.style = "";
    activeEl.classList.remove("active");
    document.querySelector(".active-icon").classList.remove("active-icon");
  });

  /**
   * Icons
   * Declare a render icon function for when the modal icon loads
   * Add listener to all the icons on the page
   */
  var renderIcon = function(iconName, iconLink) {
    // prettier-ignore
    var $modalBodyHtml = createEl(
      '<a href="'+iconLink+'" class="modal-link" title="'+iconName+'">' +
        '<span class="icon-wrapper icon-wrapper--512"></span>' +
        '<span class="modal-link__title">'+iconName+'</span>' +
      '</a>'
    );
    $modalBodyHtml.querySelector(".icon-wrapper").appendChild($modalIcon);

    $modalBody.innerHTML = "";
    $modalBody.appendChild($modalBodyHtml);

    $modalIconCurrentlyLoading = null;
  };

  var styles = {
    // transform: scale(4) translate3d(50%, 0%, 0);
    position: "fixed",
    zIndex: "10000",
    transformOrigin: "left"
  };

  var $icons = [].slice.call(
    document.querySelectorAll(".js-trigger-icon-modal")
  );
  $icons.forEach(function($icon) {
    $icon.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      $icon.parentNode.classList.add("active-icon");
      console.log($icon.parentNode);

      const {
        left,
        right,
        bottom,
        top,
        x,
        y
      } = e.target.getBoundingClientRect();
      const windowCenterX = window.innerWidth / 2; // 1680/2=840 middle point of screen
      const windowCenterXOffset = windowCenterX - 256; // 840-256=584;
      const xTranslate = (windowCenterXOffset - left) / 4; // 4 for our scale

      const windowCenterY = window.innerHeight / 2; // 780/2=470 middle point of screen
      const windowCenterYOffset = windowCenterY - 256 - window.scrollY; // 840-256=584;
      const yTranslate = (windowCenterYOffset - top) / 4; // 4 for our scale

      console.log(`scale(4) translate3d(${xTranslate}, ${yTranslate}, 0)`);
      e.target.classList.add("active");
      e.target.style.position = "fixed";
      e.target.style.zIndex = "100000";
      e.target.style.transformOrigin = "left top 0";
      e.target.style.transform = `scale(4) translate3d(${xTranslate}px, ${yTranslate}px, 0)`;

      // Get meta info about clicked icon
      // var iconName = $icon.getAttribute("title");
      var iconLink = $icon.getAttribute("href");

      // // Show the modal with a loading indicator until everything loads
      // $modalBody.innerHTML = "";
      // $modalBody.appendChild($modalLoader);
      document.body.classList.add("show-modal");

      // Listeners for when the icon loads. First try for a 1024 image. If that
      // fails, it's because there's no 1024 size, so get a 512 (which should
      // be guaranteed)
      const $img = $icon.querySelector("img");
      $img.src = $img.src.replace("/128", "/1024");
      // $modalIcon.onload = function() {
      //   $modalIcon.setAttribute("alt", iconName);
      //   renderIcon(iconName, iconLink);
      // };
      // $modalIcon.onerror = function() {
      //   // Only replace if it's 1024. We don't want an infinite loop
      //   if ($modalIcon.src.indexOf("/1024/") !== -1) {
      //     $modalIcon.src = $modalIcon.src.replace("/1024/", "/512/");
      //   }
      // };

      // Kick it off by trying to load the 1024 version and set our currently
      // loading icon in case we have to cancel
      // $modalIcon.src = $icon
      //   .querySelector("img")
      //   .getAttribute("src")
      //   .replace("/128/", "/1024/");
      // $modalIconCurrentlyLoading = $modalIcon;
    });
  });
}

function createEl(str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  return div.firstChild;
}
