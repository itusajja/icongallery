#!/bin/bash

# Sync script
# ------------------------------
# NOTE:You have to run this from the root of the project
# See http://www.savjee.be/2013/02/howto-host-jekyll-blog-on-amazon-s3/
#
# Parameters:
#   ios|mac|applewatch : The domain you want to sync
#   syncNew|syncAll : Synce only new stuff, or sync everything

# Functions
# ------------------------------

# Jekyll build
buildSite() {
    echo -e "\n--> Compiling ${DOMAIN}icongallery source..."
    jekyll build --config _config.yml,${DOMAIN}icongallery/_config.yml
}

# Sync type functions
# $1 should pass --dry-run if it's a dry run
syncNew() {
    echo -e "\n--> Sync to ${DOMAIN}icongallery.com"
    s3cmd sync $1 \
        --acl-public \
        --guess-mime-type \
        --no-preserve \
        --delete-removed \
        --skip-existing \
        _site/ s3://${DOMAIN}icongallery.com/
    echo -e "\n--> Put dependencies..."
    s3cmd put $1 \
        --acl-public \
        --guess-mime-type \
        --no-preserve \
        -r \
        index.html data.json feed.xml p s3://${DOMAIN}icongallery.com/
}

syncAll() {
    echo -e "\n--> Sync to ${DOMAIN}icongallery.com"
    s3cmd sync $1 \
        --acl-public \
        --guess-mime-type \
        --no-preserve \
        --delete-removed \
        _site/ s3://${DOMAIN}icongallery.com/
}

# Incorrect parameters
incorrectParameters() {
    echo "Usage: $0 {ios|mac|applewatch} {syncNew|syncAll}"
}

# Execute
# ------------------------------
DOMAIN=$1
SYNCTYPE=$2
case "$DOMAIN" in
    (ios|mac|applewatch) 
        case "$SYNCTYPE" in
            (syncAll|syncNew) 
                # All parameters are correct, deploy it!
                buildSite
                $SYNCTYPE --dry-run
                
                echo 
                read -p "Want to continue syncing? [y/n] " -n 1 -r
                echo 
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    $SYNCTYPE
                fi
                ;;
            (*)
                incorrectParameters
                exit 1
                ;;
        esac
        ;;
    (*)
        incorrectParameters
        exit 1
        ;;
esac 

# individual file
# s3cmd put --dry-run --no-preserve --acl-public --guess-mime-type _site/2014/desk/index.html s3://iosicongallery.com/2014/mandrill/
# individual folder
# s3cmd put --dry-run --no-preserve --acl-public --guess-mime-type -r _site/ s3://iosicongallery.com/