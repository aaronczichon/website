---
title: "Raspberry Pi as a Github Runner"
pubDate: 2024-04-12
description: "You can use a Raspberry Pi as a plug and play Github runner easily"
author: "Aaron Czichon"
image:
  src: "https://directus.aaronczichon.de/assets/fcff64aa-1ddd-445e-a5fc-531a5dde6b12.jpg?quality=70&width=2000"
  alt: "Shows a Raspberry Pi Model 3 on top of an Apple TV 4"
tags: ["Development", "Work"]
---

## Backstory

This blog is build using the [Astro](https://astro.build) library and I write my posts using markdown. The sources and content is hosted on Github, so every time I write a new article a workflow is running to deploy it via FTP to my webspace.  
Yeah I know, FTP is old and lame [but I'm old and I'm allowed to use it](https://aaronczichon.de/blog/personal-i-feel-old-now/).

My Canada blog is build the same way. Also Astro but in this case MDX for the articles. These articles often contain pictures and I wrote a custom component for handling the different image sizes.  
Internally in this component I use the [Astro Picture](https://docs.astro.build/en/guides/images/#picture-) component which allows me to generate different image formats and sizes depending on the clients device.  
As the amount of images are increase the generating of these different formats takes a long time on the Github workflow.
![Screenshot: Github Workflow Run (successful)](https://directus.aaronczichon.de/assets/c4184f5b-f28e-4dd9-a495-520884e7f79d?download)
Nearly 45min for a build is way to much. So the best option was to move the images and their sizing to my [Directus](https://docs.directus.io/) server which now handles the sizing and my build times are back to like 3 minutes.

But nevertheless it left me curious. These large build times are expensive. In Github Pro there are 3000 min included.
![Screenshot: Github Action Quota](https://directus.aaronczichon.de/assets/25126233-41c8-4ba1-8dc1-3158cca3912a.png)

So what happens if you have large build times and/or many builds on your repository? You need to pay extra for them.

## Using a Raspberry Pi as a Github runner

A long time ago I stumbled across the possibility to host your own Github runner. I always thought that it is hard to set up.  
Like every nerd I have brought my Raspberry Pi with me to Canada (of course!) so I thought: Would it work to set it up as a Github runner.

<details>
<summary>What you need</summary>

- A Raspberry Pi (obviously)
- A Github Account
- A Github Repository
- At least Debian Bullseye installed

You don't need one of the latest Raspberry Pis. I used a Raspberry Pi 3 and it worked fine.  
Important part is, that you have installed at least Debian Bullseye otherwise, if you want to use the runner for Node projects, this will throw an error.

</details>

### Setup the Pi as a runner

Go to the `Actions` tab of your Github repository and select under Mangement `Runners`, `New runner` and `New self-hosted runner`. Select as platform `Linux` and the architecture of your Raspberry Pi (ARM or ARM64).

Login to your Rasperry Pi. I suggest that you have SSH on your raspi enabled and managing it over the network.  
Follow the instructions given by Github (e.g. for ARM):

```bash
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-arm-2.315.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.315.0/actions-runner-linux-arm-2.315.0.tar.gz
echo "d84fc4854c0c9236b35219a337a359a205cae4da44b86f948f1d1e47cbe32073  actions-runner-linux-arm-2.315.0.tar.gz" | shasum -a 256 -c
tar xzf ./actions-runner-linux-arm-2.315.0.tar.gz
```

After the installation was successful you need to configure the runner for your Github Repository:

```bash
./config.sh --url https://github.com/YOUR-USERNAME/YOUR-REPO --token YOUR-TOKEN
```

Finally you can run it with `./run.sh`.

Yu can now use the runner inside your workflows with the given tags shown in the Github Runners overview of your account.  
You can also define a custom tag for a runner by clicking on the runner itself and create a new label:
![Screenshot: Github Runner Configuration](https://directus.aaronczichon.de/assets/fdedfb88-60a5-45ae-a962-04c6ed1731fe.png)

In my case I added the label `sandstone` so I can use it inside my workflows now like this:

```yaml
runs-on: sandstone
```

### Run the runner on startup

As most Raspberry Pis are running unattended you may want to start the runner service on your raspi automatically as soon as the device boots up.

For this, switch into the extracted folder from the initial setup and run the service install script:

```shell
sudo ./svc.sh install
```

After installation you need to start the service once:

```shell
sudo ./svc.sh start
```

That's it.

### Wrap Up

The Github runner works unrelated to any network configuration or interface. So as long as your device has an internet connection the runner works.  
In the case of an Raspberry Pi you can now take it with you on travel and simply plug it, boot it and if it's connected to the internet it's available for your to build your code from Github.

The combination get's neat if your Raspberry Pi is also part of your Tailscale network so you can reach it every time via SSH unrelated if you're in the same network or over the internet.

The cherry on the top is, especially if you take it with out travelling, if you have your own OpenWRT router which bridges the Airbnb/Hotel/Café Wifi for your devices with your SSID. In that case you only need to configure the network on the router if you change your location and all other devices are working directly as expected.
