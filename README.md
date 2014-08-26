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

## To-Do

1. Ads
2. "browse" page