---
title: "I want to love Windows, but..."
pubDate: 2021-01-10
description: "A letter from me to Windows which should be a love letter but can't be one. It's hard for me to use it on a daily work basis. I describe some basic problems I have and how I work around them daily."
author: "Aaron Czichon"
tags:
  [
    "Windows",
    "Problem",
    "macOS"
  ]
---

...it makes it hard for me.
Windows. I really want to love you and this should be a love letter but to be honest this is more a „suggestions and how you fail for me“ letter.

Coming from the last 4 years of working on a MacBook with macOS I started using Windows again. Truly, it wasn't my decision to use Windows again.

Switching between operating systems is hard. I'm speaking of everyday work. Using the system for 5-6 or even 10 hours a day. Not for using it for a couple of minutes for testing some development things.
It's even more difficult if you mostly living in the Terminal and command line tools. Not having an Unix system on Windows is.....horrifying.

To clarify the hardware I need to work on: It's a surface book 3 with the i7 and 32GB of RAM. And initially I thought this is a power machine in comparison to my MacBook Pro from 2016. But later on that.

### Things that make me angry about you

The initial setup on Windows is still challenging walkthrough by accepting or declining all these privacy statements. The Surface has this integrated "Face ID" technology called Windows Hello which you can use to unlock your computer just with a smile into the camera. If it's working.
During the setup for this you will be asked to train your face to the computer and a rectangle should be shown. For me the rectangle was never shown. 
After several investigations I could fix this with a Surface firmware update.
But to be clear: A brand new computer doesn't work without a firmware update. That's something which should not be the experience with a new device.

One thing I still don't understand is, that Windows in 2021 (or 2020) still doesn't has any consist UI. There are literally 4 different UIs and applications where settings of the operating system are located. That's not only annoying, it's also confusing and frustrating.

A really hard thing for me is, that the Surface doesn't have any Thunderbolt 3 ports. Working with my MacBook Pro from 2016 my home setup for the last 4 years was simple. If you on the go and coming home I only need to plugin one single Thunderbolt 3 cable and everything was setup. From external  displays to keyboard and also camera, microphone and USB-A dock.
With the surface I always need 3-4 minutes to place all the cables for the power supply (as it's proprietary and no USB-C port), adding the adapter from display port to USB-C to connect the external display and further more.

Talking about external displays, the Surface or Windows, don't who's the bad guy, still can't remember positions of application windows. So every time I disconnect an external monitor all open windows are moved to the primary, build-in screen. After reconnecting the external monitor they're not moving back to it. They're staying on the primary screen. That's a really annoying situation which is handled better on every other operating system. And yes, I also include Linux in this comparison.

The keyboard layout is also some sort of problem. I know, Windows and Linux mostly use the same layout and it's just training switching between Apple and Windows layout. I can get used to the wrong location of the `@`. But that's not the point.
It's more the location of the brackets. During development I use many of them and every time I'm using the Windows keyboard layout, I'm thinking: "Who, as a developer, has ever used this without breaking bones in his fingers?!". 
Also the functional key (`Fn`) on the Surface is a switch, not a button. And this is really annoying when using the function keys (`F1`, `F2`, etc.) and also want to use the volume up and down options. That's some decision by Microsoft I can't get used to.

I thought files search was a resolved problem in 2020. But I need to get used to reality that searching is still a problem on Windows like back on the Windows 7 days. The integrated search on `Win` + `S` is nearly useless. It shows mostly only web results with Bing and, sometimes, installed programs.

## How I improved you to make you usable

So what did I to make it better?

First for the most important thing: Not having a real terminal. 
Install Windows Sub-System for Linux (WSL). Make sure you follow the correct online tutorial and you're using WSL2. Never, ever open the default Windows console.
To improve compile time of your web applications move all your Git-Repositories and project to the WSL file system (and don't leave them inside the Windows file system).
On WSL most things you know from Unix will work nearly "perfectly". Except that they're really slow (compared to the 4 year old MacBook).
There are still many bugs inside WSL2. Just to name 2 of them: If your computer is in sleep mode the time in your WSL environment is slower than the actual system time. This can result to wrong timestamps in your Git Commits. Also if you restart your computer, Windows doesn't restart the system fully, so WSL is not working correctly after restart (e.g. all pass-through ports of local web applications are no longer reachable). You need to restart the WSL manually (by switching to PowerShell (sadly) and typing `wsl --shutdown`).
Visual Studio Code with WSL bridge is working really fine. Could recommend that as well.

The external connection situation without Thunderbolt 3. To be honest. Haven't found a good solution to this (no, I will not buy a 200€ dock with USB-C instead of Thunderbolt 3). Currently using one external 4K monitor with an USB-C to DisplayPort adapter. Can't use more than one external monitor because this results into bluescreens on the Surface book... (!)

For solving my search problem I installed the new Windows [PowerToys](https://github.com/microsoft/PowerToys). They have a really nice search function there which is similar to the spotlight search on macOS. (Keyboard shortcut could be set to `Alt` + `Space` to emulate Spotlight feeling). 

![Screenshot: search of power toys](https://directus.aaronczichon.de/assets/8acf5300-dc6c-48b9-83ae-96a3b5646009?download)

The downside: It still uses the default windows search index under the hood so not all files are found correctly. But it's better than the default search.

The PowerToys also have a nice side-effect: They're coming with a keyboard/shortcut mapper. Yes, I could get used to the windows keyboard layout but some things are not good here and I mapped them to "macOS style", as I call it:

![Screenshot: PowerToys Keymapper](https://directus.aaronczichon.de/assets/5ee6be1f-35d0-4cac-bf7c-77dae220d8c2?download)

Also I'm using the Surface only with an external keyboard as the build-in keyboard is unusable.

For making screenshots on Windows I'm currently using [Cloudshot](https://cloudshot.com/), as I mostly need something which can upload my screenshots directly to the cloud. It's also able to record a part of the screen as gif file (which I often use). 
And yes, on macOS I also use a third-party tool for screenshots, called Dropshare.

Remembering the window position on external monitors is still a problem. On some point last December I gave up on this. I don't want to use third-party tools for such a key feature of an operating system and I can't make Windows remembering external monitors.....

And: I will not start with the scaling issues on Windows in high DPI mode (like on a 4K monitor). I will leave only this screenshot here....

![Screenshot: Windows with Hight DI errors](https://directus.aaronczichon.de/assets/63ac09ef-6abe-402f-9430-59f9757bc430?download)

## My conclusion to you

Final question: 
Am I ready to use Windows and am I familiar with it?

No. Still can't get used to it. Even after many tweaks and tools I'm now using it only feels nearly good. But never really good and never perfect.
I really tried it but the lack of consist UIs, working fundamental things like external display support and Thunderbolt 3 makes it nearly unusable for me.

How do I handle it? 
That's simple: I'm slower on that Windows platform at my daily work and for longer, heavy tasks (or also often simple things) I'm still switching to 4,5 year old MacBook Pro which is, on spec paper, slower but in real environments the Surface is lagging every time. 
E.g.: Starting a Microsoft Teams call results into a mouse and keyboard input lag every time on the Surface book. So even Microsoft's own applications are working way better on macOS than on their own operating system.

Sorry Windows. I tried it. I need you to improve but in this state it's more anger than fun to use you.

(After a cool-down I may critics Azure DevOps work item management in comparison to Github issues).