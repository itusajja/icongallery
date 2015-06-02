#!/bin/bash

# Serve script
# ------------------------------
# Note: You have to run this from the root of the project
# Parameters:
#   ios|mac|applewatch : The site you want to serve
DOMAIN=$1
case "$DOMAIN" in
    (ios|mac|applewatch) 
        jekyll serve --config _config.yml,${DOMAIN}icongallery/_config.yml
        ;;
    (*)
        echo "Usage: $0 {ios|mac|applewatch}"
        exit 1
        ;;
esac 