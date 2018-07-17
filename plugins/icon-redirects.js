var debug = require("debug")("metalsmith-posts");
var multimatch = require("multimatch");
var URL = require("url");
var slugify = require("slug");
var moment = require("moment");
var path = require("path");

/**
 * Our initial redirects are from netlify's custom domain to the real site
 * From there, we'll push any individual file redirects to this array,
 * Then after looping through each file, we'll add all redirects to
 * netlify's `_redirects` file.
 */
function iconRedirects(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);

    const {
      site: { themeId }
    } = metalsmith.metadata();

    let redirects = [
      `http://${themeId}.netlify.com/* http://www.${themeId}.com/:splat 301!`,
      `https://${themeId}.netlify.com/* https://www.${themeId}.com/:splat 301!`
    ];

    Object.keys(files).forEach(file => {
      if (multimatch(file, opts.pattern).length) {
        let redirectPaths = files[file].redirect_from;
        if (redirectPaths) {
          debug("redirect(s) being added from: %s", file);

          // If there's just one redirect, add it to an array
          if (typeof redirectPaths === "string") {
            redirectPaths = [redirectPaths];
          }

          // Add a redirect to each icon's current permalink
          redirectPaths.forEach(redirectPath => {
            redirects.push(`${redirectPath} ${files[file].permalink}`);
          });
        }
      }
    });

    // Add all the redirects we found to a new file `_redirects`
    files["_redirects"] = {
      path: "_redirects",
      contents: new Buffer(redirects.join("\n"))
    };
  };
}

module.exports = iconRedirects;
