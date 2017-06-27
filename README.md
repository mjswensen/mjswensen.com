# mjswensen.github.io [![Travis](https://img.shields.io/travis/mjswensen/mjswensen.github.io.svg)](https://travis-ci.org/mjswensen/mjswensen.github.io)

Source code for [mjswensen.com](https://mjswensen.com/).

## Developing locally

### Install dependencies

Make sure Ruby, Bundler, and Yarn are installed.

    bundle install
    yarn global add browser-sync

### Local server

    bundle exec jekyll build --watch
    browser-sync start --server --files "*.css, *.html" # from within _site/
