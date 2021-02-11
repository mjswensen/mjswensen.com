---
title: "How to Make an .ico File Using the macOS Terminal"
date: 2021-02-11 07:03:36 MDT
layout: post
excerpt: Suppose you have an icon or logo at multiple resolutions and would like to combine them into a single `favicon.ico` file for your website. These are the commands you need to get up and running from the comfort of your own terminal.
---

Suppose you have an icon or logo at multiple resolutions and would like to combine them into a single `favicon.ico` file for your website. These are the commands you need to get up and running from the comfort of your own terminal.

## Step 1: install ImageMagick

Check out the [ImageMagick downloads page](https://imagemagick.org/script/download.php) for instructions on how to get it running on your machine. Personally, I like to use containerization to keep my Mac free from extraneous software that I rarely use, so I'll install ImageMagick in a Docker container instead (make sure you have Docker installed):

{% highlight shell %}
docker run -it --rm -v /absolute/path/to/icons/directory:/workdir -w /workdir ubuntu
{% endhighlight %}

This command will drop you into a `bash` session on the container. From there, it's easy to get ImageMagick installed:

{% highlight shell %}
apt update
apt upgrade
apt install -y imagemagick
{% endhighlight %}

<div class="cards tip">
  <div class="card">
    <span class="card-title">Tip!</span>
    <div class="card-body">
      <p>ImageMagick has a dependency on <code>tzdata</code>, so you will be prompted to configure your time zone upon installation. Since this is an ephemeral installation, you can just type <code>1</code> for each prompt to get through the installation process quickly.</p>
    </div>
  </div>
</div>

## Step 2: create the file

ImageMagick gives us a handy `convert` command that makes the process super easy:

{% highlight shell %}
convert input-file-16x16.png input-file-24x24.png input-file-32x32.png input-file-64x64.png favicon.ico
{% endhighlight %}

This will create the desired `favicon.ico` file.

## Step 3: verify the .ico file

ImageMagick also provides a nice utility called `identify` for inspecting our file to ensure it is formatted as we expect.

{% highlight shell %}
identify favicon.ico
{% endhighlight %}

The output should look something like this:

{% highlight shell %}
favicon.ico[0] ICO 16x16 16x16+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[1] ICO 24x24 24x24+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[2] ICO 32x32 32x32+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[3] ICO 64x64 64x64+0+0 8-bit sRGB 24838B 0.000u 0:00.000
{% endhighlight %}
