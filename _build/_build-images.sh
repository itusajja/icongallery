# #!/bin/bash
# strip warning: find . -type f -name "*.png" -exec convert {} -strip {} \;

# Take the original 512 or 1024 icon and create optimized versions for each
# 1024, 512, 256, 128, 64
DIR="../build"
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
echo "=> Moving to /built directory..."
mv *.png built