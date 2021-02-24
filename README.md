# mjswensen.com

Source code for [mjswensen.com](https://mjswensen.com/).

## Developing locally

From within the development container:

```sh
bundle exec jekyll serve --watch
```

The site will be available on http://localhost:4000.

## Deploying

```sh
git push
```

## Get the date/time for front matter

```sh
date "+%Y-%m-%d %H:%M:%S %Z" | pbcopy
```
