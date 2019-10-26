FROM ruby:2.4

COPY . /mjswensen
WORKDIR /mjswensen

RUN bundle install
