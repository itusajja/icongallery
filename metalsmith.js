var path = require("path");
var moment = require("moment");
var argv = require('minimist')(process.argv.slice(2));

var Metalsmith = require("metalsmith");
var layouts = require("metalsmith-layouts");
var rename = require("metalsmith-rename");
var timer = require("metalsmith-timer");
var pagination = require("metalsmith-pagination");
var watch = require("metalsmith-watch");
var serve = require("metalsmith-serve");
var inplace = require("metalsmith-in-place");
var debugui = require("metalsmith-debug-ui");
var ignore = require("metalsmith-ignore");
var debug = require("debug")("metalsmith");

var myplugin = require("./plugins/plugin-template");
var fileLimit = require("./plugins/file-limit");
var iconMetadata = require("./plugins/icon-metadata");
var iconPermalinks = require("./plugins/icon-permalinks");
var iconArtwork = require("./plugins/icon-artwork");
var iconCollection = require("./plugins/icon-collection");
var buildInfo = require("./plugins/build-info");

var config = require("../config.json");
var sharedConfig = require("./config.json");

var isDevelopment = process.env.NODE_ENV !== "production";

var PATH_TEMPLATES = path.join(__dirname, "./src/templates");

/**
 * Metalsmith app
 */
let app = Metalsmith(__dirname)
  .metadata({
    site: {
      ...config,
      ...sharedConfig,
      time: moment()
    },
    __DEV__: isDevelopment
    // ...helpers
  })
  .source("./src/www")
  .destination("./build")
  .clean(true)

  // Filter down the number of posts we'll actually use, if the correct argument
  // is present, i.e. `node metalsmith.js --limit=100`
  .use(fileLimit({ limit: argv.limit, pattern: "icons/*.md" }))

  // FYI instead of static HTML redirects for every file that needs one, we
  // write one giant `_redirects` file for netlify. See `_redirects`
  // However if you ever needed, you could add a .html file for each redirect
  // by following the example in the `plugins/icon-redirects`

  // Add metadata to posts (must be first)
  .use(iconMetadata({ pattern: "icons/*.md" }))
  .use(timer("add icon metadata"))
  // Add permalinks to the post (and rename .md -> .html)
  .use(iconPermalinks({ pattern: "icons/*.md" }))
  .use(timer("add icon permalinks"))
  // Copy source artwork into metalsmith build chain
  .use(iconArtwork({ pattern: "icons/**/*.html" }))
  .use(timer("add icon artwork"))
  // I create my own collections because of this
  // https://github.com/segmentio/metalsmith-collections/issues/27
  .use(iconCollection({ pattern: "icons/**/*.html" }))
  .use(timer("add an icon collection"))

  // Pagination (depends on the icon collection above)
  .use(
    pagination({
      "site.icons": {
        perPage: config.iconsPerPage,
        layout: "index.ejs",
        first: "index.html",
        path: "p/:num/index.html",
        pageMetadata: {
          title: ""
        }
      }
    })
  )
  .use(timer("add icon pagination"))

  // Template in place all our pages that have an extension of `.ejs`
  .use(
    inplace({
      engine: "ejs",
      pattern: "**/*.ejs",
      engineOptions: {
        // We have to pass this in so it knows where to look for includes
        views: [PATH_TEMPLATES]
      }
    })
  )
  .use(timer("template in place"))

  // Now template everything
  // Then rename `_redirects` because `layouts` automatically sticks .html on it
  .use(
    layouts({
      // We set blank as the default, as generators like `alias` will need a blank
      // template. This means any file you want to render with a template, you should
      // explicitly set it. Otherwise, it'll just be a blank template.
      default: "blank.ejs",
      engine: "ejs",
      directory: PATH_TEMPLATES
      // pattern: "**/*.html", // @TODO may want this?
      // engineOptions: {
      // cache: true,
      // filename: "test.json",
      // async: true
      // }
    })
  )
  .use(rename([[/_redirects.html/, "_redirects"]]))
  .use(timer("template layouts"))

  // For some reason, these files show up so we have to remove them
  .use(ignore(["**/.DS_Store"]))

  // Log out the stuff we're writing, so we know we're getting what we want
  .use(buildInfo());

/**
 * Development-related tasks, only if we're in dev mode
 */
if (isDevelopment) {
  app = app
    .use(debugui.report("end"))
    .use(
      watch({
        paths: {
          // change to files in source will rebuild themselves
          "${source}/**/*": true,
          // changes to templates will rebuild everything
          [PATH_TEMPLATES + "/**/*"]: "**/*"
        },
        livereload: isDevelopment
      })
    )
    .use(serve())
    .use(timer("serve site"));
}

/**
 * Build the app
 */
app.build((err, files) => {
  if (err) {
    throw err;
  }
  debug("Done!");
});
