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
echo $DOMAIN

# Now get the icon and post info and save them to the current directory
php _get-icon-data.php

# Now move the post.md file to the proper directory
read -p "Is this a draft? [y/n] " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    mv *.md ../${DOMAIN}icongallery/_drafts/
else
    mv *.md ../${DOMAIN}icongallery/_posts/
fi

# Now optimize images, if needed
# http://stackoverflow.com/questions/1885525/how-do-i-prompt-a-user-for-confirmation-in-bash-script
read -p "Want to optimize the images [y/n] " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Take the original 512 or 1024 icon and create optimized versions for each
# 1024, 512, 256, 128, 64
# strip warning: find . -type f -name "*.png" -exec convert {} -strip {} \;
DIR="../${DOMAIN}icongallery/img"
VARIANTS=(512 256 128 64)

echo "Begin conversions ..."
for file in *.png; do

    # Get the file basename
    # basename="$(basename "$filename" .png)"

    # Get image width
    SIZE=`identify -format "%w" $file`

    echo "=============================> ${file} (original: ${SIZE})"

    # If it's a 1024, copy it and optimize it
    if [ $SIZE = 1024 ]; then
        echo "=====> 1024 FOUND! Copying and optimizing ..."
        cp $file "${DIR}/1024/${file}"
        find "${DIR}/1024/${file}" | imageOptim -a
    fi

    # Otherwise loop through each option
    for variant in "${VARIANTS[@]}"
    do
        echo "=====> Converting & optimizing ${variant} ..."
        convert $file -resize $variant "${DIR}/${variant}/${file}"
        find "${DIR}/${variant}/${file}" | imageOptim -a
    done

done

# move the file to the built directory
echo "=> Moving to _src directory..."
mv *.png "${DIR}/_src"
