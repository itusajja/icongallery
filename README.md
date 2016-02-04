# Galleries

## To-Do

- Save filter states in URL for /search
- Move site-specific image files to site repos
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

Theme files are shared across all sites and can be found in `public/src`. This includes styles and scripts shared across sites. Examples:

  _includes
  _layouts
  _plugins
  _site
  index.html

Content which is unique to each site is stored in their respective folders in `public/src`. These are separate repositories and contain the posts, images, and configuration files for each project. Examples:

  _config.yml
  _data
  _posts
  img

Make sure you pass both the theme and site-specific config files to jekyll when you build.

`jekyll serve -w --config _config.yml,macicongallery/_config.yml`

## Plugins

- Alias Generator [https://github.com/tsmango/jekyll_alias_generator](https://github.com/tsmango/jekyll_alias_generator)


## Icons

The original icons reside in their respective repos under `/img/_src`. These are the icons pulled directly from Apple's source. I keep the originals in this spot and generate all needed assets using a script.

To do so, simply place whatever image you need the 512,256,128,64 variants for and place it in `_build`. Then run the `_build-images.sh` script. This will make copies at each size, optimize them, and stick them in the correct folder in `content/img/_src`.

### Retina Images

Use [retina.js](https://github.com/imulus/retinajs) to get hiDPI versions of each thumbnail. I modified the `RetinaImagePath()` function so it checks for images defined in the `data-at2x` attributes (because they may not exist). Additionally, I changed the selector from `getElementsByTagName('img')` to `querySelectorAll('img.icon')` so it only looks for higher resolution versions of the icons.

### Feeds

RSS feeds are published through feedburner. The old addressses, however, were transfered. They use to live at `/feed/` (which mean, I assume, a `/feed/index.xml` file at that address). Now, however, the feed lives at `/feed.xml`. This means we need redirects for the old feed.

Because S3 serves `index.html` files only, we will leave a blank file at `/feed/index.html` which has a [301 redirect](http://aws.amazon.com/blogs/aws/amazon-s3-support-for-website-redirects/) through the AWS console to `/feed.xml`. This means anyone who hits `/feed/` in the browser will go to the new feed. Additionally, anyone who hits `/feed/index.xml`, we have an [RSS XML redirect](http://www.rssboard.org/redirect-rss-feed) which sends them to `/feed.xml`.
