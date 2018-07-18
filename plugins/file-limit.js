const debug = require("debug")("metalsmith-file-limit");
const multimatch = require("multimatch");

/**
 * Take a pattern of files, and limit that collection to the number specified
 * @param {Object} opts 
 * @param {Number} opts.limit
 * @param {String|Array} opts.pattern
 */
function fileLimit(opts) {
  opts.pattern = opts.pattern || [];

  return function(files, metalsmith, done) {
    setImmediate(done);
    
    if (opts.limit && Number.isInteger(opts.limit)) {
      const matchedFiles = Object.keys(files).filter(file => multimatch(file, opts.pattern).length);

      // We're going to start from the back, but conceivably this could be customizeable
      const matchedFilesToKeep = matchedFiles.reverse().filter((file, i) => i < opts.limit);

      matchedFiles.forEach(file => {
        if (!matchedFilesToKeep.includes(file)) {
          delete files[file];
        }
      });
    }
  };
}

module.exports = fileLimit;
