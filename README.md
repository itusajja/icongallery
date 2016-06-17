# Galleries

## To-Do

- Save filter states in URL for /search
- 404 page, "oops it's not here ... check out some icons while you're here"
- 2x versions on /search
- filter styles on mobile for /search

###  Deploy To-Do

- Ads work
- Redirects work
- RSS feeds work (feedburner)

### Someday

- Use native browser `srcset` or `picture` for 2x images (though remember that `srcset` doesn't actually do a fallback to 1x for 2x specified images, so the currently javascript method works best ...)

## Jekyll

Site runs on Jekyll. The site is split into two parts: the content and the theme.

### Unique content files

Unique content is stored in the root directory. The following are files/folders that are unique to each project itself (iosicongallery, watchosicongallery, etc). These:

```
.
├── .gitignore          // can copy/paste between sites
├── _config.yml         // can copy/paste shared vars of config between sites
├── _data/
├── _drafts/
├── _posts/
├── CNAME
└── img
    ├── _src/
    ├── 32              // watchos
    ├── 64
    ├── 128
    ├── 256
    ├── 512             // ios, mac
    └── 1024            // ios, mac
```

### Shared content files

The following files/folders in the root directory are shared in the sense that they share templates that are in the theme directory. You can easily copy/paste these specific files between projects. The reason we cannot put them in the shared directory is because of how we integrate with github pages.

```
.
├── 404.html
├── feed/
|   ├── index.html
|   └── index.xml
├── feed.xml
├── index.html
└── search/
    └── index.html
```

### Theme files

Theme files are shared across all sites and can be found in `shared/`. This folder is a submodule of this repository. It includes styles, scripts, build scripts, and images shared across all three sites. Examples:

```
.
├── _build/             // scripts for creating new content
├── _jekyll/            // shared jekyll templates
|   ├── includes/
|   └── layouts/
├── api/
|   └── index.json      // shared template for outputting json of site icons
├── img/                // bunch of image files
├── scripts/
|   ├── bundle.js       // compiled JS for site
|   └── _src/           // source files for JS, npm/webpack stuff
└── styles/
    ├── _sass/          // scss partials
    └── styles.scss     // source .scss compiled by jekyll
```

## Plugins/Gems

Since we are deploying with github pages, we use the [gh-pages gem](https://github.com/github/pages-gem) so we most accurately match the prod environment for site generation.


## Icons

The original icons reside in their respective repos under `/img/_src`. These are the icons pulled directly from Apple's source. I keep the originals in this spot and generate all needed assets using a script.

To do so, simply place whatever image you need the 512,256,128,64 variants for and place it in `_build`. Then run the `_build-images.sh` script. This will make copies at each size, optimize them, and stick them in the correct folder in `img/_src`.


### Retina Images

Use [retina.js](https://github.com/imulus/retinajs) to get hiDPI versions of each thumbnail. I modified the `RetinaImagePath()` function so it checks for images defined in the `data-at2x` attributes (because they may not exist). Additionally, I changed the selector from `getElementsByTagName('img')` to `querySelectorAll('img.icon')` so it only looks for higher resolution versions of the icons.


### Feeds

RSS feeds are published through feedburner. The old addresses, however, were transfered. They use to live at `/feed/` (which means, I assume, a `/feed/index.xml` file at that address as we used to host on wordpress). Now, however, the feed lives at `/feed.xml`. This means we need redirects for the old feed.

(OLD) Because S3 serves `index.html` files only, we will leave a blank file at `/feed/index.html` which has a [301 redirect](http://aws.amazon.com/blogs/aws/amazon-s3-support-for-website-redirects/) through the AWS console to `/feed.xml`. This means anyone who hits `/feed/` in the browser will go to the new feed. Additionally, anyone who hits `/feed/index.xml`, we have an [RSS XML redirect](http://www.rssboard.org/redirect-rss-feed) which sends them to `/feed.xml`.
