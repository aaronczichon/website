---
title: "Proxy your home device through Tailscale and Nginx Proxy Manager"
pubDate: 2025-01-21
description: "How to make a service public available from your home network by using a (sub)domain without loosing security."
author: "Aaron Czichon"
tags: ["Work", "Personal"]
---

<details>
<summary>Used abbreviations</summary>
<p>
Some abbreviations used in this article (only valid for this article unless mentioned otherwise):   
- NPM -> Nginx Proxy Manager   
- TS -> Tailscale
</p>
</details>

Over the holidays I finally moved from my old webspace, which I had for the past 10 years, to a VPS (virtual private server).   
The main reason for this was that I want to run some software as containers and also because some of my projects require a backend. Although the webspace allowed to run NodeJS, PHP and Ruby it had it's limitations.    

I also have a NAS from Synology at a family members home. This NAS is running some containers which I sometimes need. E.g. my finance software is running there (which I don't want to host on a different server on the internet).   
Until now I had to login to my Tailscale network (where all my devices are part of) to access this web service.    

The first thing I've done on my VPS, besides installing Docker, was setting up Tailscale and the Nginx Proxy Manager.   
The proxy manager allows you to map incoming requests from a certain (sub)domain to a specific port, redirect to another domain or show an error page (if not mapped).   

My main thought here was: If I can access my web service by it's IP and port inside the Tailscale network, I should also be able to put the container of my proxy manager into the TS network as well and route traffic from a subdomain to this IP 🤔

Turns out, you can! By using the network features of Docker you can run Tailscale in a container with network capabilities.   
To combine both services you can use `docker-compose`.    
First of all you need to define a new service in your compose file for the Tailscale container. 
```yaml
services:
  tailscale-nginxpm:
    image: tailscale/tailscale
    container_name: srv.tailscale-nginxpm
    restart: always
    hostname: nginx-proxy-mngr
    environment:
      - TS_AUTHKEY=YOUR_TAILSCALE_AUTH_KEY
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=false
    ports:
      - 80:80
      - 81:81
      - 443:443
    volumes:
      - tailscale_data:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
volumes:
  tailscale_data:
```

As image we use the official `tailscale` image. We can give the container a name we like and defining the required environment keys.   
Replace `YOUR_TAILSCALE_AUTH_KEY` with your Tailscale authorization key. You can observe one here on your profile: [Admin Key Settings](https://login.tailscale.com/admin/settings/keys).   
In the `volumes` section you need to map either a volume or local path for the Tailscale data folder. In this example we're using a docker volume called `tailscale_data` for the persistent data.   
The second volume is the mapping between your hosts net folder and your containers net folder (as we want TS to access your hosts networking).   
The last step is to add additional capabilities for `net_admin` and `sys_module`.   
`net_admin` gives our Tailscale container the possibility to perform different network related task like interface configuration, modifying routing tables, editing firewall settings and more (everything that Tailscale does). The `sys_module` gives it the options to load and unload kernel modules (which is also required by Tailscale).   

Perfect. We now have the container configuration for our TS network. Now let's add the Nginx Proxy Manager as a second service to our docker compose file.    

For the proxy manager we add another service to our compose file:
```yaml
nginx-proxy-mngr:
    image: jc21/nginx-proxy-manager:latest
    container_name: srv.nginx-proxy-mngr
    restart: always
    depends_on:
      - tailscale-nginxpm
    network_mode: service:tailscale-nginxpm
    labels:
      - com.centurylinklabs.watchtower.enable=false
    volumes:
      - nginx-proxy-manager:/data
      - lets-encrypt:/etc/letsencrypt
```

I call this new service `nginx-proxy-mngr`. For the we use the official image and give it a name. In my case it's called `srv.nginx-proxy-mngr`.   
The trick is, that we make it depending on the Tailscale service and using the network of the Tailscale service by defining the `network_mode` to `service:tailscale-nginxpm`. This tells the NPM container that it should use the network of the Tailscale container.   
At last we need to specify two volumes. One for the storage of the NPM itself and one for the SSL certificates. This is useful if you want (and you want) protect your (sub)domains with SSL. NPM has a build-in Let's Encrypt support. So you can easily add SSL certificates to your proxied domains.

BONUS: I would recommend adding health checks to both of the containers so that you can get notified or react on unhealthy state of docker. For Tailscale you can add this:
```yaml
    healthcheck:
      test: tailscale status --peers=false --json | grep -q 'Online.*true'
      interval: 15s
      timeout: 3s
      retries: 5
```

And for NPM you can add this:
```yaml
    healthcheck:
      test: ["CMD", "/usr/bin/check-health"]
      interval: 10s
      timeout: 3s
      retries: 5
```

If you now put it all together you get a compose file for both services like this:
```yaml
version: "3.7"
services:
  tailscale-nginxpm:
    image: tailscale/tailscale
    container_name: srv.tailscale-nginxpm
    restart: always
    hostname: nginx-proxy-mngr
    environment:
      - TS_AUTHKEY=YOUR_TAILSCALE_AUTH_KEY
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=false
    ports:
      - 80:80
      - 81:81
      - 443:443
    volumes:
      - tailscale_data:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
    healthcheck:
      test: tailscale status --peers=false --json | grep -q 'Online.*true'
      interval: 15s
      timeout: 3s
      retries: 5

  nginx-proxy-mngr:
    image: jc21/nginx-proxy-manager:latest
    container_name: srv.nginx-proxy-mngr
    restart: always
    depends_on:
      - tailscale-nginxpm
    network_mode: service:tailscale-nginxpm
    labels:
      - com.centurylinklabs.watchtower.enable=false
    volumes:
      - nginx-proxy-manager:/data
      - lets-encrypt:/etc/letsencrypt
    healthcheck:
      test: ["CMD", "/usr/bin/check-health"]
      interval: 10s
      timeout: 3s
      retries: 5
      
volumes:
  tailscale_data:
  nginx-proxy-manager:
  lets-encrypt:
```

As soon as you have everything running, you can go and login to the NPM and setup your first domain to access a service running on a device in your Tailscale network!   

![Shows a screenshot of the Nginx Proxy Manager interface for configuring a proxy host for a specific domain and IP.](https://directus.aaronczichon.de/assets/027ee4b8-ce77-4799-abb6-bf2047918094.png)

If you have some cool use cases for this, let me know on [Mastodon](https://mastodon.social/@czichon) or via email on the button below!