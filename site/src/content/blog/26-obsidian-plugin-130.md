---
title: "Obsidian Location Plugin 1.3.0"
pubDate: 2024-08-08
description: "A lot of new features and improvements since the initial release."
author: "Aaron Czichon"
tags: ["Development", "Work"]
---

In April I released my first plugin for Obsidian, the Location Plugin.  
It's used to render Mapbox static images into your notes using a specific code block syntax.

Since the initial release in March I lately got [nehnehneh](https://github.com/nehnehneh) as a contributor.  
Together we extended the functionality of the plugin and just recently we release version 1.3.0 with some helpful additions.

## Alternative coordinate syntax

First thing is, that you now have an alternative syntax. You can simply provide an array of coordinates `[44.64282990208981, -63.57526398409271]` instead of separating longitude and latitude.

## Using search instead of coordinates

If you don't want to use coordinates we got you now covered as well!  
With the new keyword `search:` you can easily add an address, point of interest or a single word to search on the Mapbox address resolver API and it will automatically renders you the image of the first found location.  
As an example you can now add something like that `search: Biosphere Montreal` to your location and it will render the corresponding image.

![A image of mapbox showing the point of interest of the Biosphere in Montréal](https://directus.aaronczichon.de/assets/fd02a0bc-3017-4f87-8260-4e69cb00962f.png)

We now also have custom zoom settings. So the cropped image is no longer the default value. You can set a custom zoom settings like the other settings: Either change it in the plugin settings for changing it globally or adding it to the location code block with `zoom:`.

For those of you who are mostly copy coordinates from Google Maps and using the new array syntax we also have an improvement.  
Google writes the coordinates in a different order than Mapbox or Open Street Map. On these it's `[latitude,longitude]`. On Google Maps it's `[longitude,latitude]`.  
So until now you had to manually reorder them to show the correct location with this plugin. No longer!  
There is now a global plugin setting where you can reverse the order of coordinates. So you can enable this and just paste the coordinates from Google Maps into your location code block and you're good to go.

Hope these features are a good extensions to the plugin and you enjoying using it.  
We also have already a roadmap towards a version 2 (or whatever it will be called) with new features in the planning.  
This roadmap can be found as a milestone on the [Github page](https://github.com/aaronczichon/obsidian-location-plugin) of the plugin.

You can download the plugin and/or the update from the [Obsidian community plugin registry](https://obsidian.md/plugins?id=mapbox-location) 😊
