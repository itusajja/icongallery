// we would like you to use debug
var debug = require("debug")("js-transpilation");
var multimatch = require("multimatch");
var babel = require("babel-core");

function jsTranspilation(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);

    // Weird bug if this is `development`. See:
    // https://github.com/babel/babel/issues/6523
    // Should be fixed if/when you switch to 7?
    // FYI: it only fails when NODE_ENV is `production`
    // So we change it just for this, then reset it on our way back out
    let env = process.env.NODE_ENV
    process.env.NODE_ENV = "production";

    Object.keys(files).forEach(file => {
      if (multimatch(file, opts.pattern).length) {
        debug("js-transpilation working on: %s", file);
        
        const { code } = babel.transform(
          files[file].contents.toString(),
          {
            // some of these conditional on whether we're in development or not?
            ...(env === "production"
              ? { ast: false, comments: false, compact: true, minified: true }
              : {}),
            presets: ["react-app"]
          }
        );
        
        files[file].contents = code;
      }
    });

    process.env.NODE_ENV = env;
  };
}

module.exports = jsTranspilation;
