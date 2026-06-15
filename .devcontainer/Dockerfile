FROM ruby:latest

RUN groupadd -g 1000 ruby
RUN useradd -m -u 1000 -g ruby ruby
RUN apt-get update && apt-get install -y sudo && rm -rf /var/lib/apt/lists/*
RUN usermod -aG sudo ruby && \
  echo "ruby ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/ruby

RUN gem install bundler jekyll
