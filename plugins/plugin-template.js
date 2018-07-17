// we would like you to use debug
var debug = require("debug")("metalsmith-myplugin");
var multimatch = require("multimatch");

function plugin(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if (multimatch(file, opts.pattern).length) {
        debug("myplugin working on: %s", file);

        //
        // here would be your code
        //
      }
    });
  };
}

module.exports = plugin;
