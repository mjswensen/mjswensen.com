---
title: How to set up a Wireguard VPN for personal use
date: 2023-03-18 18:04:28 MDT
tags: software
layout: post
excerpt: "VPNs are a great way to level up your privacy online. Here's how to set one up from scratch."
---

VPNs are a great way to level up your privacy online. Here's how to set one up from scratch.

## Step 1: spin up and connect to your cloud server

Using your cloud provider of choice, provision a new server instance. Since the VPN will be for personal use only, inexpensive instances will work fine. Select any operating system that Wireguard supports; we'll assume Ubuntu for this tutorial.

Connect to your server via SSH as the `root` user.

<div class="cards tip">
  <div class="card">
    <div class="card-title">Root user</div>
    <div class="card-body">
      <p>Heads up, all commands outlined in this tutorial assume the root user, so you won't see any commands prefixed with <code>sudo</code>.</p>
    </div>
  </div>
</div>

## Step 2: install Wireguard

If you picked Ubuntu for your server's OS, you can install Wireguard with one command:

{% highlight shell %}
apt install wireguard
{% endhighlight %}

<div class="cards tip">
  <div class="card">
    <div class="card-title">Working directory</div>
    <div class="card-body">
      <p>For the remaining steps, change your working directory to <code>/etc/wireguard</code>.</p>
    </div>
  </div>
</div>

## Step 3: generate a key pair for your VPN server

First, generate a private key:

{% highlight shell %}
wg genkey > private.key
{% endhighlight %}

Then, use the private key to derive a public key:

{% highlight shell %}
wg pubkey < private.key > public.key
{% endhighlight %}

These are the keys your VPN server will use when encrypting traffic with your client VPN peers.

## Step 4: create your server configuration file

With Wireguard installed and keys generated, we're ready to create our VPN configuration.

First, find the name of the public network interface:

{% highlight shell %}
ip route list default
{% endhighlight %}

The output might look something like this: `default via ... dev eth0 proto static`—the `eth0` part is what we're after.

Create a file called `wg0.conf` with the following contents, being sure to include the private key where required, and replacing `eth0` with the name of the network interface:

{% highlight conf %}
[Interface]
SaveConfig = true
PostUp = ufw route allow in on wg0 out on eth0
PostUp = iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE
PreDown = ufw route delete allow in on wg0 out on eth0
PreDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
ListenPort = 51820
PrivateKey = <the contents of private.key>
{% endhighlight %}

## Step 5: configure IP forwarding

Add the following line at the bottom of `/etc/sysctl.conf`:

{% highlight conf %}
net.ipv4.ip_forward=1
{% endhighlight %}

Then run `sysctl -p` to load the new configuration.

## Step 6: allow UDP traffic

Update the operating system firewall to allow traffic on the port specified in the Wireguard configuration:

{% highlight shell %}
ufw allow 51820/udp
{% endhighlight %}

Restart UFW to pick up the new configuration:

{% highlight shell %}
ufw disable
ufw enable
{% endhighlight %}

## Step 7: configure the Wireguard server to start on boot

{% highlight shell %}
systemctl enable wg-quick@wg0.service
{% endhighlight %}

## Step 8: generate keys for clients

Now we'll generate keys for the devices that will be connecting to the server. Follow this process for as many clients as you need:

1. Output the private key with `wg genkey`
2. Output the corresponding public key with `echo -n '<the private key>' | wg pubkey`
3. Mark the public key as allowed with `wg set wg0 peer <the public key> allowed-ips 10.8.0.2`; for each client increment the last digit of the IP address

Verify that the public keys have been added as peers by running the `wg` command with no arguments. If you've configured three clients, the output should look something like this:

{% highlight plaintext %}
interface: wg0
  public key: <the server's public key>
  private key: (hidden)
  listening port: 51820

peer: <first client's public key>
  allowed ips: 10.8.0.2/32

peer: <second client's public key>
  allowed ips: 10.8.0.3/32

peer: <third client's public key>
  allowed ips: 10.8.0.4/32
{% endhighlight %}

## Step 9: configure clients

Finally, configure your client devices to connect to your Wireguard VPN server. This process will be a little different depending on whether you are using the iOS app, Android app, or another Linux installation of Wireguard. Generally, though, your client configuration should look something like this:

{% highlight conf %}
[Interface]
PrivateKey = <the client private key>
Address = <the client IP address>/24
DNS = <the DNS resolvers you wish to use (optional)>

[Peer]
PublicKey = <the server public key>
Endpoint = <the server IP address>:51820
AllowedIPs = 0.0.0.0/0
{% endhighlight %}

The `0.0.0.0/0` configuration value indicates that all internet traffic should be tunnelled through the VPN connection.

---

Happy tunneling!
