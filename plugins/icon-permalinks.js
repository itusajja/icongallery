var debug = require("debug")("metalsmith-posts");
var multimatch = require("multimatch");
var URL = require("url");
var slugify = require("slug");
var moment = require("moment");
var path = require("path");
/**
 * Handle permalinks for icons
 * - Sets `permalink` key for all icons to `/icons/ID/`
 * - Set the file key to `icons/ID/index.html`, that way we have a file
 *   extension and a relative path (otherwise it tries to write to the root of
 *   the hard drive)
 */
function iconPermalinks(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);

    Object.keys(files).forEach(file => {
      if (multimatch(file, opts.pattern).length) {
        debug("myplugin working on: %s", file);

        const id = files[file].id;
        const permalink = `/icons/${id}/`;
        const newFileKey = permalink.substr(1) + "index.html";

        files[newFileKey] = {
          ...files[file],
          permalink
        };

        // Delete the old post
        delete files[file];
      }
    });
  };
}

module.exports = iconPermalinks;
