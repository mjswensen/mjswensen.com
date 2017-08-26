# mjswensen.com

Source code for [mjswensen.com](https://mjswensen.com/).

## Developing locally

### Install dependencies

Make sure Ruby, Bundler, and Yarn are installed.

    bundle install
    npm -g i browser-sync

### Local server

    bundle exec jekyll build --watch --destination _mjswensen-site
    browser-sync start --server --files "*.css, *.html" # from within _mjswensen-site/

## Deploying

    JEKYLL_ENV=production bundle exec jekyll build --destination _mjswensen-site
    cd _mjswensen-site
    now
