# Galleries

Watch deploy to-do
- follow on twitter?
- google analytics
- sync all for the other two sites

## Jekyll

Site runs on Jekyll. All jekyll assets are stored in the root with two exceptions which are unique to each project: `_data` and `_config.yml`

### Shared Assets

Default jekyll files and folders are shared between projects and live in the root directory:

    _build
    _includes
    _layouts
    _plugins
    _site
    index.html

Custom assets used for themeing (such as scripts and stylesheets) are shared between sites and stored in `_assets` in the root directory:

    _assets
        _project-files
        _scss
        fonts
        img
        js

### Unique Content

Content which is unique to each site is stored in the `_content` folder in the root. These are submodules of each project and contain the posts, images, and configuration files for each project:

    content
        _config.yml
        _data
        _posts
        img

Because the jekyll config is in `_content` you have to tell jekyll where it is when testing locally:

`jekyll serve -w --config content/_config.yml`

## Plugins

- Alias Generator [https://github.com/tsmango/jekyll_alias_generator](https://github.com/tsmango/jekyll_alias_generator)
- Custom `filter.rb` which is used to return an array for related posts

## Categories & Tags

Define these in a `_data` file, then loop and check for key value pairs? Something like this:

    {
        "nicename": "Graphics & Design",
        "slug": "graphics-design"
    }

## Icons

The original icons reside in their respective repos under `[content/]img/_src`. These are the icons pulled directly from Apple's source. I keep the originals in this spot and generate all needed assets using a script.

To do so, simply place whatever image you need the 512,256,128,64 variants for and place it in `_build`. Then run the `_build-images.sh` script. This will make copies at each size, optimize them, and stick them in the correct folder in `content/img/_src`.

### Retina Images

Use [retina.js](https://github.com/imulus/retinajs) to get hiDPI versions of each thumbnail. I modified the `RetinaImagePath()` function so it checks for images defined in the `data-at2x` attributes (because they may not exist). Additionally, I changed the selector from `getElementsByTagName('img')` to `querySelectorAll('img.icon')` so it only looks for higher resolution versions of the icons.

### Feeds

RSS feeds are published through feedburner. The old addressses, however, were transfered. They use to live at `/feed/` (which mean, I assume, a `/feed/index.xml` file at that address). Now, however, the feed lives at `/feed.xml`. This means we need redirects for the old feed.

Because S3 serves `index.html` files only, we will leave a blank file at `/feed/index.html` which has a [301 redirect](http://aws.amazon.com/blogs/aws/amazon-s3-support-for-website-redirects/) through the AWS console to `/feed.xml`. This means anyone who hits `/feed/` in the browser will go to the new feed. Additionally, anyone who hits `/feed/index.xml`, we have an [RSS XML redirect](http://www.rssboard.org/redirect-rss-feed) which sends them to `/feed.xml`.

## To-Do

1. Search page takes parameters, i.e. /search?tag=blue (this can be linked from the individual post page)
2. 404 page, "oops it's not here ... check out some icons while you're here"
3. Build scripts
4. Unify categories in build scripts with IDs or something to map them to names. Perhaps map the to app store gener IDs
5. Figure out way to compress JSON file

## Deploy
1. Ads work
2. Redirects work
3. RSS feeds work (feedburner)
