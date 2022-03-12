---
title: "How to develop over HTTPS on localhost"
date: 2022-03-11 08:16:41 MST
tags: software
layout: post
excerpt: "There are a number of reasons you may wish to use HTTPS as part of your web application development workflow. Find out how to set up SSL locally."
links:
  dev.to: https://dev.to/mjswensen/how-to-develop-over-https-on-localhost-1cb5
---

There are a number of reasons you may wish to use HTTPS as part of your web application development workflow:

- Your app will likely be deployed to users via HTTPS; the closer your development environment is to production, the less likely you are to run into bugs.
- Browsers behave differently in secure contexts, and you want to avoid production-only surprises.
- You might be integrating with third-party services or APIs that require the use of HTTPS.

Keep reading to find out how to set up SSL for local development.

## Step 1: Generate a self-signed SSL certificate

Unless you are developing on a [remote development environment](https://youtu.be/zivPD-LL57k) with a static IP address, you won't have a unique domain name that points to your development environment (and even if you are, you may not want or need one). Without a unique domain name, our only option for and SSL certificate is a self-signed one for local use only. Use this command to generate one:

<div class="cards tldr">
  <div class="card">
    <div class="card-title">tl;dr</div>
    <div class="card-body">
      <p>Use the command below to generate your self-signed certificate and private key.</p>
    </div>
  </div>
</div>

{% highlight shell %}
openssl req -x509 -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -subj '/CN=localhost' -extensions EXT -config <(printf "[req]\ndistinguished_name = dn\n[dn]\nCN=localhost\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
{% endhighlight %}

Let's pick that command apart. Feel free to [skip to step 2](#step-2-install-and-trust-the-certificate) if you don't care about the details.

- `openssl req` - We're using the `openssl` program to generate our certificate. `openssl` has many sub-commands; the one we are using is [`req`, which is for generating certificates and certificate requests](https://www.openssl.org/docs/man1.1.1/man1/openssl-req.html).
- `-x509` - Output a self-signed certificate (rather than a certificate signing request that you might send off to a certificate authority—often called a "CA" for short—to be verified and signed for production use).
- `-out localhost.crt` - Write the certificate to a file called `localhost.crt`.
- `-keyout localhost.key` - Write the private key to a file called `localhost.key`.
- `-newkey rsa:2048` - Generate and use a new private key (as opposed to an existing key, which you'd specify with the `-key` option) of 2048 bits using the RSA algorithm.
- `-nodes` - Do not encrypt the private key.
- `-subj '/CN=localhost'` - Sets the subject of the certificate request. For production certs, this would include information about the company or business seeking the certificate (such as location, department, email address, etc.), but since this is a development-only certificate, the only necessary information is the "common name" ("CN" for short), `localhost`.
- `-extensions EXT` - Specifies that the extensions section of our config is delineated with a header titled `EXT`. That config is defined in the next part of the command.
- `-config <(printf "...")` - The `-config` option takes a file name containing configuration options, but rather than use a separate file we use input redirection (the `<` character) and a subshell (the command embedded between parentheses, which returns the string config) to pass the config contents directly, for convenience.

The contents of the configuration are shown more readably below:

{% highlight plain %}
[req]
distinguished_name = dn
[dn]
CN=localhost
[EXT]
subjectAltName=DNS:localhost
keyUsage=digitalSignature
extendedKeyUsage=serverAuth
{% endhighlight %}

- `[req]` - Options for the `req` subcommand are below this heading.
- `distinguished_name = dn` - Indicates that the distinguished name fields will be found in a section of the config titled `dn`.
- `[dn]` - The heading for the fields as indicated above.
- `CN=localhost` - The common name ("CN") for the certificate; in this case: `localhost`.
- `[EXT]` - The heading for the extensions, as indicated by the `-extensions` parameter above.
- `subjectAltName=DNS:localhost` - Indicates that the certificate should match the `localhost` domain name.
- `keyUsage=digitalSignature` - Indicates that the key may be used for signing the certificate.
- `extendedKeyUsage=serverAuth` - Indicate that in addition to signing the certificate, the private key will also be used to identify the server for SSL/TLS.

## Step 2: Install and trust the certificate

Now your local operating system needs to know that the certificate is trustworthy. (Otherwise you'll see a warning when you access `https://localhost` that the certificate is not trusted. This warning can be bypassed but trusting the certificate at the OS level gives a smoother development experience.)

For macOS, this can be achieved by following these steps:

1. Open the Keychain Access app.
2. Drag and drop your `localhost.crt` file onto the app.
3. Right click on the new certificate entry and choose "Get Info".
4. Expand the "Trust" section of the Get Info dialog.
5. For "Secure Sockets Layer (SSL)", choose "Always Trust".
6. Close the dialog and input your password (or TouchID) to save the changes.

There should be a similar process for trusting the certificate in Windows and Linux.

If you're working on a team, write some documentation for your teammates on how to do this (or point them to this article) so that new engineers can get up and running quickly.

## Step 3: Configure your development server to use the certificate and private key

Lastly, your development server applications need to be updated to use the certificate and private key. This will be different for each language and framework. Here are some examples:

For Netlify, the `netlify dev` server can be configured to use your SSL certificate in development by adding the following to your `netlify.toml` file:

{% highlight toml %}
[dev.https]
  certFile = "localhost.crt"
  keyFile = "localhost.key"
{% endhighlight %}

For Node.js servers, [pass the `key` and `cert` options to `https.createServer`](https://nodejs.org/dist/latest-v16.x/docs/api/https.html#httpscreateserveroptions-requestlistener).

Once configured, you should be able to access your development server via HTTPS on `localhost`!

## Additional reading

- [Certificates for localhost article by Let's Encrypt](https://letsencrypt.org/docs/certificates-for-localhost/)
- [`openssl req` manual page](https://www.openssl.org/docs/man1.1.1/man1/openssl-req.html)
