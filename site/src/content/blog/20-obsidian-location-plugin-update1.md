---
title: "Obsidian Mapbox Location Image Plugin 1.1 available!"
pubDate: 2024-05-29
description: "My Obsidian plugin for maps got an update with new functionality regarding markers and styles."
author: "Aaron Czichon"
tags: ["Development", "Work"]
---

Since last week a new version of my Obsidian plugin is available and it brings some new features!  
The 2 major new features are support for different map styles and custom markers.

## Different map styles

The first version of the plugin only supported the default street style of the static images.  
Now you have the option to set a default map style via the plugin settings and/or override the default style per code block by using the keyword: `style` and providing the supported map style.

![Screenshot of Mapbox location with dark styled street](https://directus.aaronczichon.de/assets/d1e84d2b-557e-4a71-bf32-9fa4592e3397.png)

Following map styles are now supported: `streets-v12`, `outdoors-v12`, `light-v11`, `dark-v11`, `satellite-v9`, `satellite-streets-v12`, `navigation-day-v1` and `navigation-night-v1`.

## Maki marker and custom marker

The second large feature which is now available are Maki icon marker and custom marker support.  
Maki icons are the Mapbox owned icons which are supported by the Mapbox API and Mapbox SDKs out of the box.  
Within a code block you can now change from the default `home` icon to any Maki icon you want by simply providing it via the `maki` keyword:

```
latitude: 44.64266326577057
longitude: -63.57530151565183
maki: fire-station
```

![Screenshot of Mapbox with white street style](https://directus.aaronczichon.de/assets/456e22bd-4819-433e-91c1-b6546c65b677.png)

If you don't want to use the default marker of Mapbox and a completely custom icon would fit more your needs you can now do this as well.  
There are two options here: You can either provide it through the plugin settings in the Obsidian settings panel or by providing an URL to your custom marker inside a code block.

Using the settings, simply set the `Custom Marker Icon URL` to your custom marker. I recommend using an image not larger than 50x50 pixels. Only `JPG` and `PNG` files are supported.
![Screenshot of the Mapbox location plugin settings in Obsidian](https://directus.aaronczichon.de/assets/20c91124-b59b-4830-bd6a-570bfc4dc693.png)

The global settings of the custom marker URL can be overridden by providing a `marker-url` to your code block:

```
latitude: 44.64266326577057
longitude: -63.57530151565183
marker-url: http://yourdomain.com/my-custom-marker.png
```

Hint: You cannot use the combination of Maki icon and a custom marker. If you have set a custom marker url (either in the settings or in your code block) the `maki` keyword in your code block is ignored.

## Smaller improvements

Additionally to these major new features I also done some more minor ones.  
There is now a [DOCUMENTATION.md](https://github.com/aaronczichon/obsidian-location-plugin/blob/main/DOCUMENTATION.md) file as well as a [CHANGELOG.md](https://github.com/aaronczichon/obsidian-location-plugin/blob/main/CHANGELOG.md) so it's easier to get started and see what has changed in the versions.  
It's now also no longer required to have `latitude` as the first entry of your code block and `longitude` the second one. You can place them now where you like.

## Feedback

If you have any feedback (positive or negative) feel free to reach out via the [Github repository](https://github.com/aaronczichon/obsidian-location-plugin).  
There is also a small [roadmap](https://github.com/aaronczichon/obsidian-location-plugin/milestones) on what is coming up in the next versions.
