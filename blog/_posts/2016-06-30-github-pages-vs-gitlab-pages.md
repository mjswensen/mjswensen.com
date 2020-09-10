---
title: GitHub Pages vs. GitLab Pages
date: 2016-06-30 21:59 MDT
layout: post
excerpt: I've been a longtime fan of GitHub Pages. It is a wonderful option for hosting many types of sites. However, recent movements toward a more secure web and GitHub's lack of support for HTTPS on GitHub Pages with a custom domain prompted me to start looking at other options, including GitLab Pages.
links:
  dev.to: https://dev.to/mjswensen/github-pages-vs-gitlab-pages-jjn
---

I've been a longtime fan of [GitHub Pages](https://pages.github.com/). It is a wonderful option for hosting many types of sites. However, recent movements toward a more secure web and [GitHub's lack of support for HTTPS on GitHub Pages with a custom domain](https://github.com/isaacs/github/issues/156) prompted me to start looking at other options, including [GitLab Pages](https://pages.gitlab.io/).

GitLab Pages has a lot of great features, many of which are similar to those of GitHub Pages (there's no question that they are shooting for feature parity with the large incumbent). But there was one problem that was an absolute show-stopper for me: painfully slow build queues. For that reason primarily, I moved back over to GitHub Pages.

These are the primary differences I found between the two services:

|  | GitHub Pages | GitLab Pages |
| - | - | - |
| Static site generator support | Jekyll only, no plugins | Completely customizable build, therefore any SSG is supported (including plugins) |
| Build configuration | Optional; Jekyll sites will be built automatically, and non-Jekyll sites are published directly. Tests can be set up easily through [travis-ci.org](https://travis-ci.org/) | Required; without a valid build definition GitLab Pages won't know how to deploy your site. Setting up the build definition in `.gitlab-ci.yml` is easy and is very similar to setting up `.travis.yml` for GitHub Pages project |
| Build queue time | Almost always instantaneous, both on the GitHub Pages side and the Travis CI side | Excruciatingly slow; of the several builds I triggered on my site, the average wait time was a couple of hours |
| Support for HTTPS | [Partial](https://github.com/isaacs/github/issues/156) | [Yes](https://about.gitlab.com/2016/04/07/gitlab-pages-setup/#custom-domains) |
| CDN support | [Out-of-the-box](https://github.com/blog/1715-faster-more-awesome-github-pages) | Not provided by GitLab Pages but can be configured with free tiers of popular CDN providers |

GitLab Pages has a lot of great features. And the GitLab.com service is generally fantastic, especially given that it's free. One of my favorite parts is that they offer free build instances (they call them "runners") as part of the GitLab.com offering (and the CI is built right into the core product—another plus). The only issue is that since the runners are free, they are overworked and the build queues can be hours long (at the time of writing, at least). While it's still a wonderful service, the delayed builds means a feedback loop that is too slow for feature development and a production deploy time that is too unpredictable.

That slowness and the need to configure CDN myself outweighed my desire to enable TLS on my site for now. And given GitHub's track record, I also have a sneaking suspicion that TLS support on GitHub Pages is just around the corner. In which case I'll be extra glad I stayed.
