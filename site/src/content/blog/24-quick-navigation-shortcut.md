---
title: "Quick navigate to a stored location (Apple Maps & Shortcuts)"
pubDate: 2024-08-01
description: "Simple store a location where you can later navigate to with a single tap."
author: "Aaron Czichon"
tags: ["Personal", "Shortcuts"]
---

Picture the following situation.  
You're new to a city and you doesn't know your surrounding area very well. You often need to pick up your phone to navigate to a specific location.  
This, for example, can be the location of your accommodation.  
So to navigate to a specific location you need to re-enter it every time to into the app and start the directions again.  
That can be annoying.

I find myself currently often in this situation and I want to quickly store a location for later (because that's the point where I want to go later on the day) and then starting the directions with a single tap instead of re-entering the address again.

For this situation I build 2 shortcuts using Apple Maps and the app [Data Jar](https://datajar.app). Data Jar is a pretty simple but useful app because it let store key-value pairs on iCloud and write / read them through a shortcut.  
So I created a first shortcut which can take a location as input from the share sheet and stores this location into a data jar key called `currentTargetLocation`:

![Screenshot of the apple shortcuts app storing the the given location into a key](https://directus.aaronczichon.de/assets/353f32c6-be49-4f7a-9b8d-5e6120a09c16.png)

Then I create a second shortcut which I call `Navigate to 📍`. This shortcut reads the key `currentTargetLocation` from the data jar store and opens the Apple Maps walking directions to that point.

![Screenshot of an shortcut that reads the stored value from the data jar app and opens apple maps](https://directus.aaronczichon.de/assets/89b4545d-6db4-4d48-882b-bed9255ebe39.png)

If I now place this second shortcut to my home screen I can simply tap it and get directly the directions from my current location to the stored location.

A new location can simply be stored by selecting one on Apple Maps, clicking the share button and sending it to the shortcut `Store location`. Simple as that!

See it in action:

<div style="position: relative;" class="video">
  <iframe
    src="https://customer-rnx58v5rm01lsk0m.cloudflarestream.com/583f57db1f8920c2b5f89316d27f007e/iframe?poster=https%3A%2F%2Fcustomer-rnx58v5rm01lsk0m.cloudflarestream.com%2F583f57db1f8920c2b5f89316d27f007e%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
    loading="lazy"
    style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
  ></iframe>
</div>
