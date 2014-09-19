# #!/bin/bash

# First get the domain
read -p "What domain? [ios/mac] " DOMAIN

# Now get the icon and post info and save them to the current directory
php _get-icon-data.php

# Now move the post.md file to the proper directory
mv *.md ../${DOMAIN}icongallery/_posts/

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

    # # Create each image size off original
    # echo "=> Converting image size ..."
    # convert $file -resize 512x512 "${DIR}/512/${file}"
    # convert $file -resize 256x256 "${DIR}/256/${file}"
    # convert $file -resize 128x128 "${DIR}/128/${file}"
    # convert $file -resize 64 "${DIR}/64/${file}"

    # # Optimize each image size
    # echo "=> Optimizing images..."
    # find "${DIR}/512/${file}" | imageOptim -a
    # find "${DIR}/256/${file}" | imageOptim -a
    # find "${DIR}/128/${file}" | imageOptim -a
    # find "${DIR}/64/${file}" | imageOptim -a
done

# move the file to the built directory
echo "=> Moving to _src directory..."
mv *.png "${DIR}/_src"
