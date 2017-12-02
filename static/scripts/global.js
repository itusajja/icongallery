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
 * 
 * Modal Links
 * Only try doing a modal if it's the home page or a "pagination" page
 * 
 */

if (location.pathname === "/" || location.pathname.substring(0, 3) === "/p/") {
  // addModalFunctionality();
}

function addModalFunctionality() {
  /**
   * VARS
   */
  // We keep track of which image is loading, in case user closes modal
  // while the image is still loading we can reset the onload event
  var $modalIconCurrentlyLoading = null;
  var $modal = createEl(
    '<div class="modal">' +
      '<button class="modal__close">&#215;</button>' +
      '<div class="modal__body"></div>' +
    '</div>'
  );
  var $modalBody = $modal.querySelector('.modal__body');
  var $modalLoader = createEl(
    '<img src="/shared/static/img/loading.gif" alt="loading" width="32" height="32" />'
  );
  var $modalIcon = createEl(
    '<img width="512" height="512" class="icon" />'
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
  $modal.querySelector('.modal__body').addEventListener("click", function(e) {
    e.stopPropagation();
  });
  document.body.appendChild($modal);

  /**
   * Icons
   * Declare a render icon function for when the modal icon loads
   * Add listener to all the icons on the page
   */
  var renderIcon = function(iconName, iconLink) {
    var $modalBodyHtml = createEl(
      '<a href="'+iconLink+'" class="modal-link" title="'+iconName+'">' +
        '<span class="icon-wrapper icon-wrapper--512"></span>' +
        '<span class="modal-link__title">'+iconName+'</span>' +
      '</a>'
    );
    $modalBodyHtml.querySelector('.icon-wrapper').appendChild($modalIcon);

    $modalBody.innerHTML = '';
    $modalBody.appendChild($modalBodyHtml);

    $modalIconCurrentlyLoading = null;
  }

  var $icons = [].slice.call(document.querySelectorAll(".js-trigger-icon-modal"));
  $icons.forEach(function($icon) {
    $icon.addEventListener("click", function(e) {
      e.preventDefault();

      // Get meta info about clicked icon
      var iconName = $icon.getAttribute("title");
      var iconLink = $icon.getAttribute("href");

      // Show the modal with a loading indicator until everything loads
      $modalBody.innerHTML = '';
      $modalBody.appendChild($modalLoader);
      document.body.classList.add("show-modal");

      // Listeners for when the icon loads. First try for a 1024 image. If that
      // fails, it's because there's no 1024 size, so get a 512 (which should
      // be guaranteed)
      $modalIcon.onload = function() {
        $modalIcon.setAttribute('alt', iconName);
        renderIcon(iconName, iconLink);
      };
      $modalIcon.onerror = function() {
        // Only replace if it's 1024. We don't want an infinite loop
        if ($modalIcon.src.indexOf("/1024/") !== -1) {
          $modalIcon.src = $modalIcon.src.replace("/1024/", "/512/");
        }
      };
      
      // Kick it off by trying to load the 1024 version and set our currently
      // loading icon in case we have to cancel
      $modalIcon.src = $icon
        .querySelector("img")
        .getAttribute("src")
        .replace("/128/", "/1024/");
      $modalIconCurrentlyLoading = $modalIcon;
    });
  });
}

function createEl(str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  return div.firstChild;
}
