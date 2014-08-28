# Galleries

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
- Pageless redirects [https://github.com/nquinlan/jekyll-pageless-redirects](https://github.com/nquinlan/jekyll-pageless-redirects)
- RSS Feed Generator [https://github.com/agelber/jekyll-rss](https://github.com/agelber/jekyll-rss)

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

## To-Do

1. Ads
2. "browse" page
3. Retina versions of each
