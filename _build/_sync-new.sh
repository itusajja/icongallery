# #!/bin/bash

# First get the domain
# Get it from the working directory
# http://stackoverflow.com/questions/229551/string-contains-in-bash
CURDIR=$(pwd);
if [[ $CURDIR == *iosicongallery* ]]; then
    DOMAIN="ios"
elif [[ $CURDIR == *macicongallery* ]]; then
    DOMAIN="mac"
else
    echo 'Cannot get the domain. Exiting...'; exit
fi
echo "--> Syncing with ${DOMAIN}icongallery.com"

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