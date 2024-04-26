---
title: "Obsidian Location Plugin"
pubDate: 2024-04-26
description: "I published my Obsidian mapbox location plugin for everyone. Now available in the Obsidian community plugins."
author: "Aaron Czichon"
image:
  src: "https://directus.aaronczichon.de/assets/605c1449-ec1b-48f1-aabc-211487871805.png?quality=70&width=1000"
  alt: "Shows an obsidian stone laying on a table along a map and a pen on paper"
tags: ["Plugin", "Obsidian", "Development", "Github"]
---

Here we are. More than a year ago, I think it was February 2023, I developed an Obsidian plugin for myself.  
Since 1,5 years now I'm using Obsidian as my main app for writing down everything. And by everything I mean everything.  
This goes from work project notes, to blog articles (like this one) to quickly typed notes which I need to "remember" as to writing periodic notes on a daily and weekly basis.

The periodic notes and my meeting notes are the thing where the plugin I developed comes into place.  
I like to track where I have worked on what day. Also I find it useful to define a meeting location, whether it's in the office, remote or at a customers place.  
So instead of just writing down the place where I worked or had the meeting I want my notes to be more visual. That's where this plugin comes in place.

The plugin itself takes a latitude and longitude value as a code block inside Obsidian and, as soon as it detects it, renders the location on a Mapbox image like this:

![Screenshot of rendered map using map box](https://directus.aaronczichon.de/assets/870c7b67-9332-4c13-9fbd-5af6631faf42.png)

The syntax for it is quite simple:

```markdown
````location
Latitude: 44.64266326577057
Longitude: -63.57530151565183
\```
```

(ignore the `\` it's only for escaping the character here)

As my work life plays around my computer I created a simple Apple Shortcut which get my current location and formats it directly into code block for Obsidian:

![Shows a screenshot of an apple shortcut which gets the current location and builds a markdown string for the obsidian location plugin and copies it to the clipboard](https://directus.aaronczichon.de/assets/179eddd5-d6d7-4d45-9ce8-baa9e197cf06.png)

Now, more than a year later I made the plugin configurable so that you can now provide the Mapbox API key, the marker color and the marker size via the Obsidian settings.  
I created a public [Github repository](https://github.com/aaronczichon/obisidian-location-plugin) and made the whole thing open source. So it's now free to use for everyone 🎉

I also created a pull request to the official community plugin list so that it's installable through the community plugin list inside the settings of Obsidian. You can now install it there easily as well:

![Shows the settings screen of Obsidian in specific the settings ob the location plugin](https://directus.aaronczichon.de/assets/7854f8f8-f96f-48f6-a3b3-e0eeb82f27d2.png)

You may like the plugin and I hope it brings some more visuality to your notes!  
I already thinking of extending it's functionality with some new features like different markers, more flexible syntax and maybe interactive map integration.

If you also interested in the Apple Shortcut you can download it here:

<div class="inline-icon">

![Apple Shortcuts Icon](https://directus.aaronczichon.de/assets/23f8cc21-af0e-45f8-a63a-2da8a2a93475.svg) [Obsidian Location Shortcut](https://www.icloud.com/shortcuts/beacd0d4265d4dbeace00e5639ad76d4)

</div>
