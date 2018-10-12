# mjswensen.com

Source code for [mjswensen.com](https://mjswensen.com/).

## Developing locally

    docker-compose up dev

Then serve the contents of `_mjswensen-site` (e.g., `cd _mjswensen-site && npx http-server`).

## Deploying

    docker-compose run -e JEKYLL_ENV=production dev bundle exec jekyll build --destination _mjswensen-site
    cd _mjswensen-site
    now
