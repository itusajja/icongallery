# #!/bin/bash

# Run Jekyll
#echo "-> Running Jekyll"
#cd ../ && jekyll build --config macicongallery/_config.yml

# Get the domain we're working with
read -p "What domain? [ios/mac] " DOMAIN

# Dry run upload to S3
echo -e "\n--> Dry Run upload to S3...\n"
s3cmd sync --dry-run --acl-public --guess-mime-type --exclude '.DS_Store' --exclude 'README.md' --delete-removed ../_site/ s3://${DOMAIN}icongallery.com/

# If dry run is ok, continue sync; otherwise exit
echo # new line
read -p "Want to continue syncing? [y/n] " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "\n--> Syncing with S3...\n"
    s3cmd sync --acl-public --guess-mime-type --exclude '.DS_Store' --exclude 'README.md' --delete-removed ../_site/ s3://${DOMAIN}icongallery.com/
    echo -e "\n--> Done!"
fi
echo #extra line




# Sync: remaining files & delete removed
#s3cmd sync --acl-public --delete-removed . s3://macicongallery.com/

# See http://www.savjee.be/2013/02/howto-host-jekyll-blog-on-amazon-s3/

# # Sync media files first (Cache: expire in 10weeks)
# echo "\n--> Syncing media files..."
# s3cmd sync --acl-public --exclude '*.*' --include '*.png' --include '*.jpg' --include '*.ico' --add-header="Expires: Sat, 20 Nov 2020 18:46:39 GMT" --add-header="Cache-Control: max-age=6048000"  _site/ s3://www.savjee.be/

# # Sync Javascript and CSS assets next (Cache: expire in 1 week)
# echo "\n--> Syncing .js and .css files..."
# s3cmd sync --acl-public --exclude '*.*' --include  '*.css' --include '*.js' --add-header="Cache-Control: max-age=604800"  _site/ s3://www.savjee.be

# # Sync html files (Cache: 2 hours)
# echo "\n--> Syncing .html"
# s3cmd sync --acl-public --exclude '*.*' --include  '*.html' --add-header="Cache-Control: max-age=7200, must-revalidate"  _site/ s3://www.savjee.be

# # Sync everything else, but ignore the assets!
# echo "\n--> Syncing everything else"
# s3cmd sync --acl-public --exclude '.DS_Store' --exclude 'assets/'  _site/ s3://www.savjee.be/

# # Sync: remaining files & delete removed
# s3cmd sync --acl-public --delete-removed  _site/ s3://www.savjee.be/
