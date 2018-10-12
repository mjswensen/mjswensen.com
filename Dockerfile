FROM ruby:2.3

COPY . /mjswensen
WORKDIR /mjswensen

RUN bundle install
