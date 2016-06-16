#!/usr/bin/env bash
set -e # halt script on error

bundle exec jekyll build
bundle exec htmlproofer ./_site --url-ignore /linkedin.com/
[ $(grep \\.css _site/sitemap.xml -c) -eq 0 ]
