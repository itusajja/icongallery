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
    s3cmd sync --dry-run --acl-public --guess-mime-type --no-preserve --delete-removed _site/ s3://${DOMAIN}icongallery.com/

    # If dry run is ok, continue sync; otherwise exit
    echo # new line
    read -p "Want to continue syncing? [y/n] " -n 1 -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "\n--> Syncing with S3...\n"
        s3cmd sync --acl-public --guess-mime-type --no-preserve --delete-removed _site/ s3://${DOMAIN}icongallery.com/
        #echo -e "--> Done!"
    fi
else
    echo 'You gotta pass in a domain. Exiting...'; exit
fi