# mjswensen.com

Source code for [mjswensen.com](https://mjswensen.com/).

## Developing locally

    docker-compose up

The site will be available on http://localhost:5000.

## Deploying

    docker-compose run -e JEKYLL_ENV=production builder bundle exec jekyll build --destination _mjswensen-site
    now
