---
title: "Obsidian Location Plugin v2"
pubDate: 2025-04-30
description: "Version 2 of the location plugin now supports interactive maps!"
author: "Aaron Czichon"
tags: ["Development", "Work"]
---

It’s been a while since the last version of my [Obsidian Location Plugin](https://github.com/aaronczichon/obsidian-location-plugin).   
I wanted to release the new version 2 during the holiday season but missed this timeline. Nevertheless I published v2 at the end of March!   

## What’s new?

Most importantly, I now created a dedicated website and documentation for the plugin which can be found [here](https://obsidian-location.czichon.cloud/). This side contains the documentation of v1.x and the current documentation of version 2 as well.    
We now have support for some commands, so that you don’t have to manually add e.g. location from your clipboard. You can also change various settings via commands instead clicking through the settings panel.

The most awaited feature actually is now also available as a preview: Interactive Maps!

## Interactive Maps

Interactive maps is a new feature with a new code block for your notes!
By using the keyword `interactive-location` for a code block you can now force the plugin to render a location inside an interactive map.

Here is an example: [Screen Recording](https://share.czichon.cloud/Screen-Capture-2025-04-30-10-22-30)

Sadly this feature currently does not support custom markers, icons and so on. It’s in preview and I’m testing it throughout my own notes.

## Future Goals

What are the future goals for the plugin and features for an upcoming version?   
Well most importantly: With interactive maps it should support multiple locations. So a next step would be adding support for multiple locations on an interactive map.    
I’m also thinking of adding radius support and more to the interactive map and also supporting existing feature like maki icons, colours and custom markers.    
Right now I’m not quite sure what a good syntax for this would be. If you have any suggestions, let me know!
