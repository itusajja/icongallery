#!/bin/bash

# Sync script
# ------------------------------
# NOTE:You have to run this from the root of the project
# See http://www.savjee.be/2013/02/howto-host-jekyll-blog-on-amazon-s3/
#
# Parameters:
#   ios|mac|applewatch : The domain you want to sync
#   new|all : Synce only new stuff, or sync everything

# Functions
# ------------------------------


# new() {
#     echo -e "\n--> Sync to ${DOMAIN}icongallery.com"
#     s3cmd sync $1 \
#         --acl-public \
#         --guess-mime-type \
#         --no-preserve \
#         --delete-removed \
#         --skip-existing \
#         _site/ s3://${DOMAIN}icongallery.com/
#     echo -e "\n--> Put dependencies..."
#     s3cmd put $1 \
#         --acl-public \
#         --guess-mime-type \
#         --no-preserve \
#         -r \
#         _site/index.html _site/data.json _site/feed.xml _site/p s3://${DOMAIN}icongallery.com/
# }

# Sync type functions
# $1 should pass --dry-run if it's a dry run
# --skip-existing \
sync() {
    echo -e "\n--> Sync to ${DOMAIN}icongallery.com"
    s3cmd sync $1 \
        --acl-public \
        --guess-mime-type \
        --no-preserve \
        --delete-removed \
        public/dist/ s3://${DOMAIN}icongallery.com/
    echo -e "\n--> Manually put gzipped files..."
    s3cmd put $1 \
        --acl-public \
        --guess-mime-type \
        --no-preserve \
        --recursive \
        public/dist/data.json public/dist/assets/scripts s3://${DOMAIN}icongallery.com/
}

# Execute
# ------------------------------
DOMAIN=$1
case "$DOMAIN" in
    (ios|mac|applewatch)
        # All parameters are correct, deploy it!
        # Run Gulp prod first
        echo "Starting gulp..."
        gulp prod --${DOMAIN}
        sync --dry-run

        echo
        read -p "Want to continue syncing? [y/n] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # sync everything
            sync
            # then set gzip content-enconding on gzipped files
            echo -e "\n--> Modify headers for gzipped files..."
            s3cmd modify \
                --acl-public \
                --add-header=Content-Encoding:gzip \
                -r \
                --exclude '*' \
                --include 'assets/scripts/*.js' \
                --include 'data.json' \
                s3://${DOMAIN}icongallery.com/
        fi
        echo -e "\nDone. Don't forget to commit changes."
        ;;
    (*)
        echo "Usage: $0 {ios|mac|applewatch}"
        exit 1
        ;;
esac

# individual file
# s3cmd put --dry-run --no-preserve --acl-public --guess-mime-type _site/2014/desk/index.html s3://iosicongallery.com/2014/mandrill/
# individual folder
# s3cmd put --dry-run --no-preserve --acl-public --guess-mime-type -r _site/ s3://iosicongallery.com/
