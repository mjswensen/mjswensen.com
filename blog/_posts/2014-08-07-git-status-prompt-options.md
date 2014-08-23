---
title: Options For Git Status in Shell Prompt
date: 2014-08-07 22:01:00
tags: software productivity
layout: post
excerpt: When it comes to customizing your Bash prompt to give you more information about the status of a Git repository, there are a lot of options out there. This post covers using the built-in options that ship with Git.
sitemap:
  lastmod: 2014-08-23 13:39:33
---

When it comes to customizing your Bash prompt to give you more information about the status of a Git repository, there are a lot of options out there. This post covers using the built-in options that ship with Git, as opposed to a third-party alternatives like [this](https://github.com/magicmonty/bash-git-prompt) or [this](https://github.com/lvv/git-prompt).

Once Git is installed, all you need to do is:

1. Load the `git-prompt.sh` file (comes with Git) in your `~/.bashrc` or `~/.profile` file
2. Add `$(__git_ps1)` somewhere in your bash prompt variable (look for `PS1` in that same files) 

The current branch name will always be displayed. However, there are a few other options you can use to add more than just the current branch name to your prompt. The available configurations are not easily Google-able, so I sifted through the [source](https://raw.githubusercontent.com/git/git/master/contrib/completion/git-prompt.sh) and listed them here. The available options are:

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>GIT_PS1_SHOWDIRTYSTATE</code></td>
      <td>any nonempty value</td>
      <td>shows <code>*</code> or a <code>+</code> for unstaged and staged changes, respectively</td>
    </tr>
    <tr>
      <td><code>GIT_PS1_SHOWSTASHSTATE</code></td>
      <td>any nonempty value</td>
      <td>shows <code>$</code> if there are any stashes</td>
    </tr>
    <tr>
      <td><code>GIT_PS1_SHOWUNTRACKEDFILES</code></td>
      <td>any nonempty value</td>
      <td>shows <code>%</code> if there are any untracked files</td>
    </tr>
    <tr>
      <td rowspan="7"><code>GIT_PS1_SHOWUPSTREAM</code></td>
      <td><code>auto</code></td>
      <td>shows <code>&lt;</code>, <code>&gt;</code>, <code>&lt;&gt;</code>, or <code>=</code> when your branch is behind, ahead, diverged from, or in sync with the upstream branch, respectively</td>
    </tr>
    <tr>
      <td colspan="2" class="meta">(alternatively to <code>auto</code>, a space-delimited list of the following options)</td>
    </tr>
    <tr>
      <td><code>verbose</code></td>
      <td>show number of commits ahead/behind (+/-) upstream</td>
    </tr>
    <tr>
      <td><code>name</code></td>
      <td>if verbose, then also show the upstream abbrev name</td>
    </tr>
    <tr>
      <td><code>legacy</code></td>
      <td>don't use the '--count' option available in recent versions of git-rev-list</td>
    </tr>
    <tr>
      <td><code>git</code></td>
      <td>always compare HEAD to @{upstream}</td>
    </tr>
    <tr>
      <td><code>svn</code></td>
      <td>always compare HEAD to your SVN upstream</td>
    </tr>
    <tr>
      <td rowspan="5"><code>GIT_PS1_DESCRIBE_STYLE</code></td>
      <td colspan="2" class="meta">(determines the style of the current commit when in a detached HEAD state, when set to one of the following values)</td>
    </tr>
    <tr>
      <td><code>contains</code></td>
      <td>relative to newer annotated tag (e.g., <code>v1.6.3.2~35</code>)</td>
    </tr>
    <tr>
      <td><code>branch</code></td>
      <td>relative to newer tag or branch (e.g., <code>master~4</code>)</td>
    </tr>
    <tr>
      <td><code>describe</code></td>
      <td>relative to older annotated tag (e.g., <code>v1.6.3.1-13-gdd42c2f</code>)</td>
    </tr>
    <tr>
      <td><code>default</code></td>
      <td>exactly matching tag</td>
    </tr>
  </tbody>
</table>

Here's how you might put it all together in your `~/.bashrc` or `~/.profile` file:

{% highlight bash %}
# First, load up the git-prompt.sh file that ships with Git. You
# might consider copying it to your home folder first. On my Mac
# OS X (Mavericks) setup, the file resides in
# /Applications/Xcode.app/Contents/Developer/usr/share/git-core/.
test -f ~/git-prompt.sh && . ~/git-prompt.sh

# Then, set the options as desired. Remember that the current
# branch name is displayed no matter what.
export GIT_PS1_SHOWSTASHSTATE=true
export GIT_PS1_SHOWDIRTYSTATE=true
export GIT_PS1_SHOWUNTRACKEDFILES=true
export GIT_PS1_SHOWUPSTREAM="auto"

# Finally, add $(__git_ps1) to the prompt variable. That's it!
PS1="\u@\h \w\$(__git_ps1) \$ "
{% endhighlight %}

Here is how the prompt might look:

![Git status embedded in bash prompt](/blog/images/git-prompt.png)
