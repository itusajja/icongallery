# Galleries

## Develop `npm start`

## Deploy `npm run deploy`

## How it Works

Site runs on Jekyll. The site consists of two repos: the site repo and the theme repo (this one).

### Site Repo

Unique content is stored in the root directory of the site repo. The following are files/folders that are unique to site and it's respective repo (iosicongallery, watchosicongallery, macosicongallery):

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
    ├── 512             // ios, macos
    └── 1024            // ios, macos
```

#### Shared Files

The following files/folders in each respecitve site repo are shared in the sense that they share templates that are in the theme repo. You can easily copy/paste these specific files between projects. The reason we cannot put them in the shared directory is because of how we integrate with github pages.

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

### Theme Repo

Theme files are shared across all site projects and can be found in `shared/`. This folder is a submodule of each site repository. It includes styles, scripts, automation scripts, and images shared across all three sites. Examples:

```
.
├── src/
|   ├── automation/     // scripts for creating new content
|   ├── jekyll/         // shared jekyll templates
|   |   ├── includes/
|   |   └── layouts/
|   ├── scripts/        // source .js files
|   └── styles/         // source .sass files
├── api/
|   └── index.json      // shared template for outputting json of site icons
├── img/                // shared of image files
├── bundle.js           // shared, compiled JS
└── styles.scss         // source .scss, gets compiled to .css by jekyll
```

## Plugins/Gems

Since we are deploying with github pages, we use the [gh-pages gem](https://github.com/github/pages-gem) so we most accurately match the prod environment for site generation.

### Feeds

RSS feeds are published through feedburner. The old addresses, however, were transfered. They use to live at `/feed/` (which means, I assume, a `/feed/index.xml` file at that address as we used to host on wordpress). Now, however, the feed lives at `/feed.xml`. This means we need redirects for the old feed.

(OLD) Because S3 serves `index.html` files only, we will leave a blank file at `/feed/index.html` which has a [301 redirect](http://aws.amazon.com/blogs/aws/amazon-s3-support-for-website-redirects/) through the AWS console to `/feed.xml`. This means anyone who hits `/feed/` in the browser will go to the new feed. Additionally, anyone who hits `/feed/index.xml`, we have an [RSS XML redirect](http://www.rssboard.org/redirect-rss-feed) which sends them to `/feed.xml`.

## To-Do

- [ ] 404 page, "oops it's not here ... check out some icons while you're here"
- [ ] filter styles on mobile for /search