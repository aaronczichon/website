---
title: "Running Nextcloud behind a proxy"
pubDate: 2025-05-12
description: "Correctly operating a Nextcloud instance behind proxy and SSL."
author: "Aaron Czichon"
tags: ["Development", "Work"]
---

As I’m currently move all my data away from US companies one of the major task is to move to a self-hosted file storage and sharing solution.   
My first and current try is using the Synology Drive as I already have a running Synology NAS. The problem there is, that it no longer gets any updates because it’s too old (10 years) in the view of Synology. It still runs smoothly my main data storage as a RAID and also is upgradable with newer disks. So why should I buy a new one?
Therefor I’m look for a better file sharing and storage option like Nextcloud. It’s widely used and runs on nearly every hardware. 

For such things I have a mini PC with an Intel N150 running at home. It’s part of my Tailscale network and therefore I can make it reachable through my Nginx proxy manager.

If you want to give your Nextcloud instance, which I’m running inside a docker container, a real, public domain you need to update the Nextcloud configuration itself.
First you need to set the new domain so that all the sharing links and stuff are working correctly:

```php
'overwrite.cli.url' => 'https://your.domain',
```

After restarting the docker container now everything is working based on your configured domain.

If you’re using one of the mobile apps you now may run into an issue:
It will stuck on logging in. That’s because it redirects internally always from `http` to `https` and therefore it doesn’t resolve your identity correctly.
The solution is simple. Update your `config.php` to override the protocol always to `https`, as from now on you only want to reach your Nextcloud from your domain:
```php\
'overwriteprotocol' => 'https',
```

Restart the container and done. You can now also login without a loop into the Nextcloud mobile apps!