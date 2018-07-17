var debug = require("debug")("metalsmith-icon-artwork");
var multimatch = require("multimatch");
var path = require("path");
var fs = require("fs");

const ARTWORK_SRC = path.join(__dirname, "../../img");

/**
 * For each icon that exists, get it's associated icon sizes from
 * the source and copy them to the same directory where we write the
 * icon's `index.html` file. If the file doesn't exist, add metadata about that
 * so we know when doing our templating what sizes are available for @2x.
 *
 *   icons/
 *      facebook-events-2018-09-01/
 *        index.html
 *        1024.png
 *        512.png
 *        256.png
 *        128.png
 *      another-app-2018-09-01/
 *        ...
 */
function iconArtwork(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if (multimatch(file, opts.pattern).length) {
        debug("myplugin working on: %s", file);

        const sizes = [1024, 512, 256, 128];

        sizes.forEach(size => {
          const imgIn = path.join(
            ARTWORK_SRC,
            `${size}`,
            `${files[file].id}.png`
          );
          const imgOut = path.join(file, `../${size}.png`);

          // If that size icon artwork exists, write it out. Otherwise, add
          // meta info to the icon about how it's missing.
          if (fs.existsSync(imgIn)) {
            fs.readFile(imgIn, function(err, buffer) {
              if (err) return done(err);
              files[imgOut] = { contents: buffer };
            });
          } else {
            if (files[file].missingIconSizes) {
              files[file].missingIconSizes.push(size);
            } else {
              files[file].missingIconSizes = [size];
            }
          }
        });
      }
    });
  };
}

module.exports = iconArtwork;
