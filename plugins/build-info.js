var debug = require("debug")("metalsmith-build-info");
var multimatch = require("multimatch");

function buildInfo() {
  return function(files, metalsmith, done) {
    setImmediate(done);

    let filesMutable = Object.keys(files);

    const filterRm = pattern => {
      const matches = multimatch(filesMutable, pattern);
      matches.forEach(file => {
        filesMutable.splice(filesMutable.indexOf(file), 1);
      });
      return matches;
    };

    debug("/icons/:id/ - %s", filterRm("icons/**/*.html").length);
    debug("/icons/:id/*.png - %s", filterRm("icons/**/*.png").length);
    debug("/p/*/ - %s", filterRm("p/**/*").length);
    debug("/assets/ - %s", filterRm("assets/**/*").length);
    debug("Other: %s  %s", filesMutable.length, "\n" + filesMutable.join("  "));
  };
}

module.exports = buildInfo;
