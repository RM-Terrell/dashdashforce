!#/bin/bash
# WIP
# - android-chrome-192x192.png
# - android-chrome-512x512.png
# - apple-touch-icon.png
# - favicon-16x16.png
# - favicon-32x32.png
# - favicon.ico
# - mstile-150x150.png
# - safari-pinned-tab.svg

magick convert logo.png -resize 192x192 android-chrome-192x192.png
magick convert logo.png -resize 512x512 android-chrome-512x512.png
magick convert logo.png -resize 180x180 apple-touch-icon.png
magick convert logo.png -resize 16x16 favicon-16x16.png
magick convert logo.png -resize 32x32 favicon-32x32.png
magick convert logo.png -resize 150x150 mstile-150x150.png
magick convert logo.png -resize 16x16 favicon.ico

#! TODO figure out svg pipeline
