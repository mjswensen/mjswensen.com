---
title: Options For Git Status in Shell Prompt
date: 2014-08-07 22:01:00
tags: software productivity
layout: post
---

When it comes to customizing your Bash prompt to give you more information about the status of a Git repository, there are a lot of options out there. This post covers using the built-in options that ship with Git, as opposed to a third-party alternatives like [this](https://github.com/magicmonty/bash-git-prompt) or [this](https://github.com/lvv/git-prompt). The configurations available to the built-in prompt customization are not easily Google-able, so I thought I'd list them here.

The available options are:

* `GIT_PS1_SHOWDIRTYSTATE` shows a `*` or a `+` for unstaged and staged changes respectively when set to **any nonempty value**
* `GIT_PS1_SHOWSTASHSTATE` shows a `$` for any stashes present when set to **any nonempty value**
* `GIT_PS1_SHOWUNTRACKEDFILES` shows a `%` in the presence of untracked files when set to **any nonempty value**
* `GIT_PS1_SHOWUPSTREAM` shows a `<`, `>`, `<>`, or an `=` when your branch is behind, ahead, diverged from, or in sync with the upstream branch respectively, when set to **the string "auto"**. Alternatively, you can set this option to a **space-delimited list of the following values**:
  * `verbose` - show number of commits ahead/behind (+/-) upstream
  * `name` - if verbose, then also show the upstream abbrev name
  * `legacy` - don't use the '--count' option available in recent versions of git-rev-list
  * `git` - always compare HEAD to @{upstream}
  * `svn` - always compare HEAD to your SVN upstream
* `GIT_PS1_DESCRIBE_STYLE` determines the style of the current commit when in a detached HEAD state, when set to **one of the following values**:
  * `contains` - relative to newer annotated tag (v1.6.3.2~35)
  * `branch` - relative to newer tag or branch (master~4)
  * `describe` - relative to older annotated tag (v1.6.3.1-13-gdd42c2f)
  * `default` - exactly matching tag

There are a couple of other options available, depending on how you utilize the script when configuring your prompt. Note that the current branch name is always displayed, regardless of whether or not any options are configured.

Here's how you might put it all together in your `.bashrc` or `.profile` file:

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
