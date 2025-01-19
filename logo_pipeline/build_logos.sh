#!/bin/bash

# Usage:
# 1. Place new logo next to this script titled "logo.png". 1k x 1k pixels has been used so far.
# 2. Run the script with `./build_logos.sh`

# This will create all the necessary favicon files in the public/favicon directory
# except for the svg file, which so far needs to be created via a vector graphics editor
# until im smart enough to figure out how to do it with imagemagick

output_dir="../public/favicon/"

magick convert logo.png -resize 192x192 "$output_dir/android-chrome-192x192.png"
magick convert logo.png -resize 512x512 "$output_dir/android-chrome-512x512.png"
magick convert logo.png -resize 180x180 "$output_dir/apple-touch-icon.png"
magick convert logo.png -resize 16x16 "$output_dir/favicon-16x16.png"
magick convert logo.png -resize 32x32 "$output_dir/favicon-32x32.png"
magick convert logo.png -resize 150x150 "$output_dir/mstile-150x150.png"
magick convert logo.png -resize 16x16 "$output_dir/favicon.ico"

echo "Logo conversion complete!"