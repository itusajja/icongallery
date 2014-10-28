# #!/bin/bash

# Get the domain we're working with
read -p "What domain? [ios/mac] " DOMAIN

# Switch to _site folder
cd ../_site/

# Dry run new and upload to S3 for new and dependant files
echo -e "\n--> Dry run sync new files...\n"
s3cmd sync --dry-run --acl-public --guess-mime-type --skip-existing --exclude-from ../_build/_files.exclude . s3://${DOMAIN}icongallery.com/
echo -e "\n--> Dry run put dependencies...\n"
s3cmd put --dry-run --acl-public --guess-mime-type -r index.html data.json feed.xml p s3://${DOMAIN}icongallery.com/

# If dry run is ok, continue sync; otherwise exit
echo # new line
read -p "Want to continue syncing? [y/n] " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "\n--> Syncing new files...\n"
    s3cmd sync --acl-public --guess-mime-type --skip-existing --exclude-from ../_build/_files.exclude . s3://${DOMAIN}icongallery.com/
    echo -e "\n--> Putting new file dependencies...\n"
    s3cmd put --acl-public --guess-mime-type -r index.html data.json feed.xml p s3://${DOMAIN}icongallery.com/
    echo -e "\n--> Done!"
fi
echo #extra line

# individual file
# s3cmd put --dry-run --acl-public --guess-mime-type -r _site/2014/mandrill/index.html p s3://iosicongallery.com/2014/mandrill/