# #!/bin/bash

# Capture the DOMAIN dynamically based off parent folder
# all folders should be the domain name, i.e. applewatchicongallery.com
dir=$(basename `pwd`)
DOMAIN=${dir/icongallery.com/}
echo ${DOMAIN}

# For capturing the domain Manually
# DOMAIN=$1
# case "$DOMAIN" in
#     (ios|mac|applewatch)
#         ;;
#     (*)
#         echo "Usage: $0 {ios|mac|applewatch}"
#         exit 1
#         ;;
# esac

# Change working directory
# (script written to work inside build-scripts)
cd shared/_build

# Export the domain so we can use it in python script
# http://stackoverflow.com/questions/17435056/read-bash-variables-into-a-python-script
export DOMAIN

# Retrieve the icon and post info from iTunes API
# and save them to the current directory
python get-icon-data.py

# Now move the post.md file to the proper directory
read -p "Is this a draft? [y/n] " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    mv *.md ../../_drafts/
else
    mv *.md ../../_posts/
fi

# Take the original 512 or 1024 icon and create optimized versions for each
# 1024, 512, 256, 128, 64
# strip warning: find . -type f -name "*.png" -exec convert {} -strip {} \;
DIR="../../img"


# Apple watch, convert .jpg to .png
echo "Converting JPG to PNG..."
if [[ $DOMAIN == *applewatch* ]]; then
    mogrify -format png *.jpeg
    rm *.jpeg
    VARIANTS=(256 128 64 32)
else
    VARIANTS=(512 256 128 64)
fi

echo "Optimizing images ..."
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
echo "=> Moving original to _src directory..."
mv *.png "${DIR}/_src"

# Go back to root since we changed it
cd ../../
