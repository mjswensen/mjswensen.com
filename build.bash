#!/usr/bin/env bash
set -e # halt script on error

OUT_DIR="_mjswensen-site"

echo "Building site..."
bundle exec jekyll build --destination $OUT_DIR

echo "Making sure CSS files didn't make it into the sitemap..."
[ $(grep \\.css $OUT_DIR/sitemap.xml -c) -eq 0 ]

PROD_SITEMAP="./prod-sitemap.xml"

echo "Downloading production sitemap..."
curl mjswensen.com/sitemap.xml > $PROD_SITEMAP

echo "Ensuring that all previously existing picks are still there..."
grep -o '\/picks\/[^\<]*' $PROD_SITEMAP | xargs -t -I % grep -q % $OUT_DIR/sitemap.xml

echo "Ensuring that all previously existing presentations are still there..."
grep -o '\/presentations\/[^\<]*' $PROD_SITEMAP | xargs -t -I % grep -q % $OUT_DIR/sitemap.xml

echo "Ensuring that all previously existing posts are still there..."
grep -o '\/blog\/[^\<]*' $PROD_SITEMAP | xargs -t -I % grep -q % $OUT_DIR/sitemap.xml

echo "Cleanup..."
rm $PROD_SITEMAP
