# #!/bin/bash

# NOTE:You have to run this from the root of the project
# See http://www.savjee.be/2013/02/howto-host-jekyll-blog-on-amazon-s3/

# Pass the domain you want to sync in
DOMAIN=$1
if [[ -n "$DOMAIN" ]]; then

    # Run Jekyll for the right site
    echo -e "\n--> Compiling ${DOMAIN}icongallery source..."
    jekyll build --config _config.yml,${DOMAIN}icongallery/_config.yml

    # Dry run upload to S3
    echo -e "\n--> Dry run sync to ${DOMAIN}icongallery.com"
    s3cmd sync --dry-run --acl-public --guess-mime-type --no-preserve --skip-existing _site/ s3://${DOMAIN}icongallery.com/
    echo -e "\n--> Dry run put dependencies..."
    s3cmd put --dry-run --acl-public --guess-mime-type --no-preserve -r index.html data.json feed.xml p s3://${DOMAIN}icongallery.com/



    # If dry run is ok, continue sync; otherwise exit
    echo # new line
    read -p "Want to continue syncing? [y/n] " -n 1 -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "\n--> Syncing to ${DOMAIN}icongallery.com"
        s3cmd sync --dry-run --acl-public --guess-mime-type --no-preserve --skip-existing _site/ s3://${DOMAIN}icongallery.com/
        echo -e "\n--> Put dependencies...\n"
        s3cmd put --dry-run --acl-public --guess-mime-type --no-preserve -r index.html data.json feed.xml p s3://${DOMAIN}icongallery.com/
    fi
else
    echo 'You gotta pass in a domain. Exiting...'; exit
fi

# individual file
# s3cmd put --dry-run --no-preserve --acl-public --guess-mime-type _site/2014/desk/index.html s3://iosicongallery.com/2014/mandrill/
# individual folder
# s3cmd put --dry-run --no-preserve --acl-public --guess-mime-type -r _site/ s3://iosicongallery.com/