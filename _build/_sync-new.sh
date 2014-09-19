# #!/bin/bash

# Get the domain we're working with
read -p "What domain? [ios/mac] " DOMAIN

# Dry run upload to S3
echo -e "\n--> Dry Run upload to S3...\n"
s3cmd sync --dry-run --acl-public --guess-mime-type --skip-existing --exclude-from _files.exclude ../_site/ s3://macicongallery.com/

# If dry run is ok, continue sync; otherwise exit
echo # new line
read -p "Want to continue syncing? [y/n] " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "\n--> Syncing new files...\n"
    s3cmd sync --acl-public --guess-mime-type --skip-existing --exclude-from _files.exclude ../_site/ s3://macicongallery.com/
    echo -e "\n--> Putting new file dependencies...\n"
    s3cmd put --acl-public --guess-mime-type ../_site/index.html s3://macicongallery.com/
    s3cmd put --acl-public --guess-mime-type ../_site/data.json s3://macicongallery.com/
    s3cmd put --acl-public --guess-mime-type ../_site/feed.xml s3://macicongallery.com/
    echo -e "\n--> Done!"
fi
echo #extra line
