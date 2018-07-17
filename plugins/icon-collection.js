// we would like you to use debug
var debug = require("debug")("metalsmith-icon-collection");
var multimatch = require("multimatch");

function iconCollection(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);

    const metadata = metalsmith.metadata();

    if (!metadata.site.icons) {
      metadata.site.icons = [];
    }

    Object.keys(files).forEach(file => {
      if (multimatch(file, opts.pattern).length) {
        debug("icon-collection working on: %s", file);

        // If the icon already exists in the collection, update it with the new info
        // Otherwise, just add it.
        const index = metadata.site.icons.findIndex(icon => {
          return icon.id === files[file].id;
        });
        if (index !== -1) {
          metadata.site.icons[index] = files[file];
        } else {
          metadata.site.icons.push(files[file]);
        }
      }
    });

    // Sort our new array in place.
    // We can't just say sort by `date` because some posts have the same date
    // So we concatenate the two values we want to sort by: date then id (title)
    // https://stackoverflow.com/questions/11379361/how-to-sort-an-array-of-objects-with-multiple-field-values-in-javascript
    metadata.site.icons.sort((a, b) => {
      const aConcat = a.date.format("YYYYMMDD") + a.id;
      const bConcat = b.date.format("YYYYMMDD") + b.id;

      if (aConcat < bConcat) {
        return 1;
      } else if (aConcat > bConcat) {
        return -1;
      } else {
        return 0;
      }
    });
  };
}

module.exports = iconCollection;
