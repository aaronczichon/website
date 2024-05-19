---
title: "How I structure my work"
pubDate: 2024-05-18
description: "Some people asked me how my work routine looks like. I tried to write it down."
author: "Aaron Czichon"
image:
  src: "https://directus.aaronczichon.de/assets/409e2108-87a9-4464-83da-cef2656783b5.jpg?quality=70&width=1000"
  alt: "Showing Aaron sitting fully dressed up in warm clothes in a chair on the upper patio in front of the ocean in Newfoundland. It's sunny but cold."
tags:
  [
    "Work Routine",
    "Routine",
    "Developer",
    "Engineering",
    "Things",
    "Workflow",
    "Obsidian",
  ]
---

## Intro

I often get asked on how I can keep up with my work, manage multiple projects and have some free time left for side and/or open source projects.  
My answer is simply: Make a plan and prepare accordingly. The next question mostly is on how do I structure my days.  
So this post gives you some insights on what daily structure helps **me** to get my tasks and work done. You may find something useful for yourself. Please keep always in mind that what works for me may not work for you. So adjust it to your needs.

## Batteries included

This article follows through a typical workday of myself, divided into 3 sections: Work start, during the work day and ending a work day.  
I also added a section for an `end of the week` recap and a bonus section with some tools I use. The tools section is unimportant as this article focuses on the structure and work behaviour and not on tools. As tools you can use anything you like or suits you well.

## Starting a work day

Like for many people, my first thing in the morning is checking E-Mails. Luckily I don't get much as most of my connections take place over Teams or similar tools.  
For each mail I decide either if it's important right now or needs an action at a later point.  
If it's important right away I'll answer it directly. If it's something that needs an action later or can be done at a later point in the day I create a task in my todo app `Things`.

Next step is checking my Teams (or similar communication tool). I'm currently working with a different timezone and I may have some messages which needed to be answered or some tasks to do which I'll then move to my Things inbox as well.

![Shows a screenshot of the Things 3 app with my Today list opened](https://directus.aaronczichon.de/assets/00837ad0-f1a1-4439-acc3-308bcfea0cb1.png)

The actual "start" of the day is done by creating a new "Daily Note" inside Obsidian, which I use as my [second brain](https://www.studysmarter.co.uk/magazine/second-brain/).  
This note has multiple sections:

- Goals: What are the 3 main goals for this day?
- Work + Meetings: Here I'm logging every task which I do during the day and also link my meeting notes
- Where I work today: This is used to log the location where I've been working this day based on location coordinates which I obtain through an Apple shortcut.

I check my calendar and prepare the meeting notes for the meetings I have on this day. Then I define my 3 main targets for this day.

Now I start prioritising my work. The main tool for this is my todo list (which is Things 3 in my case).  
Things works for me because they can sort todos into projects and also allow me to tag these task. But the most convenient feature is, that it is based on a todo date and has an inbox.  
So my routine here is that I first go through all new todos n the inbox and sort them to the correct project, tag them and schedule them when I need to do it. Doesn't matter if it's today, tomorrow or in 4 months. Important to me is, that the inbox is empty before I continue.  
I can switch now to the `Today` section and see everything that need to be done this day. This includes work, open source, article writing (like this one) and even private things like doing the laundry or do some errands.

## During a work day

Developers and engineers love not to be interrupted during their work phases as they mostly can only focus on one thing. I'm no exception to this. The key to this is on how you handle it.  
It's important that you block yourself some time slots inside your calendar for focused work (like 1-2h blocks). Make sure you turn off your phone and your communication tools like Teams or Slack at this time.  
Let your team know that you do this to keep focus and they not going mad at you if they can't reach you right away.

It can't be avoided that new todos and tasks are popping up during the day. All I use for them is a global shortcut to create a new Things todo. During the creation I already make the first pre-decision. If it need to be done today, I move it to the correct project and set it to the current date so it's in my todo list for the day. If it's not important it will be automatically added to the inbox and will be sorted in the evening.

For anything besides tasks and todos, which are created in Things, I use Anybox. This is mostly used for storing links but also for some short notes or images which I may need later.

### Working on projects

My main work is related to projects and repositories. Therefore I streamlined most of my project work so that I have the same environment for every project.  
With the responsibility of multiple projects a context switch between them can't be avoided fully. And everyone who praises something else should show me how it works in the IT consulting industry. It doesn't.

Being an engineer the work is not about coding. It's about writing. A lot of writing.  
Over the years I found a simple rule which can be more or less applied to all of my projects: for every line code I write, I write 2-3 lines of context or documentation. And by documentation I don't mean code documentation (as this counts towards my line of codes). I means the things around a feature/task/bug/issue (or whatever you want to call it).  
If you often work with Azure DevOps you may be familiar with the Feature -> User Story -> Task structure.  
I use these items to document every step, every decision and every status update and change I make.  
If I change something, I document why I changed it. If I need to make a technical and architectural decision, I document them on the related work item so that everyone can follow on how I did get there. If I can't finish a work item because of an upcoming meeting or end of the work day, I document my current status and what is left. If I need more (or less) time for something, I document it and, more important, why.  
This helps customers and teammates to follow your work and get a sense of **why** you do something. I would even do this if nobody cares because the most important part is: I'm doing this for myself. If I come back to a feature or a codebase the next day I can quickly check the work item or issue and go through the comments I made on what was the last status and what needs to be done next.  
This makes context switching a lot easier and you have the good side effect that your customer always can see the current status.

Commit everything. Even if it's not done yet. Some people may say that you should only commit things that are, at least, compiling. But I follow this only for "main" branches not for feature or bugfix branches. This simply has to do with the fact that if you end your work day you commit yourself to the current status and you can continue on this set the next day (and you not rely on the machine you currently working on).

Things that are a lifesaver: [Visual Studio Code Devcontainers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers). Really. Using dev containers to clone repositories directly into a docker container frees you from the mess with different versions and setups on a local computer. And it makes onboarding of new members easier.

Also a huge part of my work is reviewing pull requests. For this I also have a recurring task in Things to check across the projects for assigned PRs and review them. There is an opportunity to write a whole separate article on reviewing pull requests. I'll come back to that later.

![Screenshot of the Obsidian app showing my daily note](https://directus.aaronczichon.de/assets/0660fdec-d14f-44a3-9fb7-f82b09466760.png)

## Ending a work day

As typical in the IT consulting industry I need to document my working hours which I spend on projects and also to get payed at the end of the month.  
A main task is also to commit everything which inside my current repositories so in case of an emergency, like when my computer crashes (likely) or someone steals it (unlikely), I can continue with my work on another computer the next day.

I check my Things todo list and check if all the urgent things are done.  
In the best case everything, that was planned for the days, is done. I also check my daily note, in Obsidian, if I reached my 3 daily goals. If I didn't reached them I write down, at the end of the note, what was the reason for not reaching them and how I can avoid these events.  
The last step of the day then is the "sorting" part again. Sorting all the new todos in the Things inbox and all the new links and notes inside my Anybox app.

## Shutting down a week

At the end of the week I do short week recap. This includes reflecting on what I've done and finished this week and writing it into a weekly note in Obsidian.  
I use a self build Apple shortcut to get all the tasks of Things which I finished this week and add them to the weekly note.  
At the end I check if I reached my weekly goals or what prevented me from doing so and write a short summary of the week which usually also includes some personal aspects. Most personal recap of days, weeks and months are done in my Journal and my `year in numbers` sheet. In the future I can write about them as well.

That's it!

## Final words

As this all may sound structured and very goal driven, trust me, it's not. I started with some small things, like writing down everything into the Things app. As soon as this habit sticked I added more. Building a habit here is the key to success.  
It's even more easier if you're a person who loves structure and preparation. If that is not something for you, you may should pick another strategy to get your work done.  
My work routine is far from perfect but I'm always adjusting and improving it to make it better and to fit into my work life even more.

## Working remotely

Especially if you work most of the time remotely or from home it's important that you build some kind of habits on how you get your work done.  
As a software developer it's not an important factor where you are or when you're working. It's important how you're working and if you get your work done. That's the only factor that matters.  
![Showing a meme three times the same drawing of a person in front of a zoom call. Every drawing has a topic. The first "Remote" the second "Hybrid" and the third "Office".](https://directus.aaronczichon.de/assets/fc70f611-0ab5-4598-b2d5-26146b287a9f.png)

## Tools I use

It's completely unimportant which tools you use to get the work done.  
Besides the common stuff like Visual Studio Code, Git, Mail, Teams/Slack, etc. I have found some which I'm sticking to and I really like to work with. They might not fit in your work routine (simple by having other preferences, another platform or you simply don't like them) but I share some of them anyway with you.

**Things 3**
This is the most important tool in my life. None of the other todo apps can to the basics so good and a global quick entry option that works so nicely.

**Obsidian**
Since I started working with the Zettelkasten approach 2 years ago I tried many tools. Obsidian is the one I'm using now since 1,5 years. I even developed my [own plugin](https://aaronczichon.de/blog/18-obsidian-location-plugin/) for it.

**Apple Shortcuts**
It was horrible when they released it. But since then a lot has changed and you can build cool workflows with it.

**Anybox**
This is the newest tool in my set which I'm using since April 2023. It stores quick notes and all my bookmarks.

**TablePlus**
Even if you only need to connect to database once a year I would recommend TablePlus.

**MindNode**
Best mind map tool. This blog entry idea grow inside a MindNode map.

**Strongbox**
I moved from 1Password 2 years ago. I wanted something on the open source format of Keepass and Strongbox is the prettiest and best client for a Keepass database.

**Maccy**
Clipboard managers are still a things. This one is open source and works perfectly if you only want to use it with the keyboard.
