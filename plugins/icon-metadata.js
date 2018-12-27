var debug = require("debug")("metalsmith-posts");
var multimatch = require("multimatch");
var URL = require("url");
var slug = require("slug");
var moment = require("moment");
var path = require("path");
var fs = require("fs");

const slugify = str => slug(str, { lower: true });

function iconMetadata(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);

    const { site } = metalsmith.metadata();

    Object.keys(files).forEach(file => {
      if (multimatch(file, opts.pattern).length) {
        debug("myplugin working on: %s", file);

        // Set the `layout` for all posts
        files[file].layout = "icon.ejs";

        // Set the `date` for all posts.
        //
        // Note: Metalsmith turns all the `date` properties in our .md files into
        // JS Date objects. We want to just keep them as YYYY-MM-DD strings
        // for convenience. But we'll also provide a moment date object for
        // other places where we need formatting
        files[file].date = moment.utc(files[file].date);

        // Set an `id` for each icon, which is a combination of slug + date
        // i.e. 'facebook-events-2017-08-11'
        files[file].id =
          files[file].slug + "-" + files[file].date.format("YYYY-MM-DD");

        // Set other metadata based on the current metadata
        const {
          categoryId,
          colorId,
          developer,
          developerUrl,
          designer,
          designerUrl
        } = files[file];

        // Map the `category` name to every icon that has a `categoryId`
        // Make it a string as we don't need it as a number anywhere
        if (categoryId) {
          files[file].categoryId = String(files[file].categoryId);
          files[file].category = site.categoriesById[categoryId];
        }

        // Map the `color` name to every ion that has a `colorId`
        if (colorId) {
          files[file].color = site.colorsById[colorId];
        }

        // Add `developerUrlDomain` where relevant
        if (developerUrl) {
          files[file].developerUrlDomain = getDomain(developerUrl);
        }

        // Add `designerUrlDomain` where relevant
        if (designerUrl) {
          files[file].designerUrlDomain = getDomain(designerUrl);
        }

        // Add `developerId` where releveant
        if (developer) {
          files[file].developerId = slugify(developer);
        }

        // Add `designerId` where relevant
        if (designer) {
          files[file].designerId = slugify(designer);
        }

        // Add `isPreIos7` bool for ios icons only
        if (site.themeId === "ios") {
          files[file].isPreIos7 = files[file].date.isBefore("2013-09-13");
        }
      }
    });
  };
}

function getDomain(str) {
  let url = URL.parse(str).hostname;
  if (url) {
    url = url.replace("www.", "");
  }
  return url;
}

module.exports = iconMetadata;
