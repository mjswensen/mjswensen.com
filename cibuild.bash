#!/usr/bin/env bash
set -e # halt script on error

echo "Building site..."
bundle exec jekyll build

echo "Checking link and image URLs..."
bundle exec htmlproofer ./_site --url-ignore /linkedin.com/

echo "Making sure CSS files didn't make it into the sitemap..."
[ $(grep \\.css _site/sitemap.xml -c) -eq 0 ]

PROD_SITEMAP="./prod-sitemap.xml"

echo "Downloading production sitemap..."
curl mjswensen.com/sitemap.xml > $PROD_SITEMAP

echo "Ensuring that all previously existing picks are still there..."
grep -o '\/picks\/[^\<]*' $PROD_SITEMAP | xargs -t -I % grep -q % _site/sitemap.xml

echo "Ensuring that all previously existing presentations are still there..."
grep -o '\/presentations\/[^\<]*' $PROD_SITEMAP | xargs -t -I % grep -q % _site/sitemap.xml

echo "Ensuring that all previously existing posts are still there..."
grep -o '\/blog\/[^\<]*' $PROD_SITEMAP | xargs -t -I % grep -q % _site/sitemap.xml

echo "Cleanup..."
rm $PROD_SITEMAP
