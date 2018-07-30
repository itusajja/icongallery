# Icon Galleries Theme

## Development: `npm start`

## Build: `npm run build`

## Netlify build: `npm run build-netlify`

## New Post

From the root of the parent repo (i.e. `iosicongallery.com/`) run `./shared/scripts/create-post.sh`

### Site Repo

Unique content is stored in the root directory of the site repo. The following are files/folders that are unique to site and it's respective repo (iosicongallery, watchosicongallery, macosicongallery):

```
.
├── _config.json
├── netlify.toml
├── _drafts/
├── _posts/
└── img
    ├── _src/
    ├── 32              // watchos
    ├── 64
    ├── 128
    ├── 256
    ├── 512             // ios, macos
    └── 1024            // ios, macos
```

#### Shared Files

The following files/folders in each respective site repo are shared in the sense that they share templates that are in the theme repo. You can easily copy/paste these specific files between projects. The reason we cannot put them in the shared directory is because of how we integrate with github pages.

```
.
├── 404.html
├── api.json
├── feed/
|   ├── index.html
|   └── index.xml
├── feed.xml
├── feed.json
├── index.html
└── search/
    └── index.html
```

### Theme Repo

Theme files are shared across all site projects and can be found in `shared/`. This folder is a submodule of each site repository. It includes styles, scripts, automation scripts, and images shared across all three sites. Everything in `_src` is used during compilation. Everything in `static` doesn’t need processing from any build tool and is just copied over verbatim. Examples:

```
.
├── _src/               // prefixed with underline so jekyll watches changes
|   ├── jekyll/         // shared jekyll templates
|   |   ├── includes/
|   |   └── layouts/
|   └── scripts/        // source .js files
├── scripts/            // automated and build scripts
└── static/
    ├── img/            // shared image files
    ├── scripts/        // shared js files, both compiled and not
    └── styles/         // shared CSS files that don't need processing
```

## Plugins/Gems

Since we are deploying with github pages, we use the [gh-pages gem](https://github.com/github/pages-gem) so we most accurately match the prod environment for site generation.

### Feeds

RSS feeds are published through feedburner. The old addresses, however, were transfered. They use to live at `/feed/` (which means, I assume, a `/feed/index.xml` file at that address as we used to host on wordpress). Now, however, the feed lives at `/feed.xml`. This means we need redirects for the old feed.

(OLD) Because S3 serves `index.html` files only, we will leave a blank file at `/feed/index.html` which has a [301 redirect](http://aws.amazon.com/blogs/aws/amazon-s3-support-for-website-redirects/) through the AWS console to `/feed.xml`. This means anyone who hits `/feed/` in the browser will go to the new feed. Additionally, anyone who hits `/feed/index.xml`, we have an [RSS XML redirect](http://www.rssboard.org/redirect-rss-feed) which sends them to `/feed.xml`.
