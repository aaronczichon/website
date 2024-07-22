---
title: "Ignore future changes for existing files in Git"
pubDate: 2024-07-12
description: "Ever wondered how you can ignore future changes to a file with Git?"
author: "Aaron Czichon"
tags: ["Work", "Development"]
---

My colleagues often asking me questions about specific Git functionality. One question which pops up quite often is: How can I remove an existing file from tracking changes by using the `.gitignore` file? Or: How can I ignore future changes to a specific, already existing file in Git?

You might have noticed that, if you have an existing file and want to ignore all future changes to it, it doesn't work by simply adding this file to the `.gitignore`.  
That's not a bug of Git, it's actually a feature.  
The `.gitignore` file only works for new changes which will pushed to the tracking index of Git itself for the first time.  
If your file is already tracked for changed by Git, all future changes will also be tracked.  
If a new file is created or a change is made to an untracked file, then Git will take a look at the `.gitignore` file and check if the path matches with one inside the `gitignore` file. If not, it will be adding the changes to the tracking index and from there on they will be tracked.

So how to solve the problem to ignore future changes to an existing file.  
There are actually 2 options.  
The first one is the simpliest one if you don't need the file at all in your repository.  
Delete the existing file and commit the changes. Afterwards add the file to the `.gitignore` and commit it. Now you can recreate the file and it will no longer be tracked for changes.  
The second option (which is the more interesting one) is by removing the existing file from the index.  
Remove the existing file from the tracking index with `git rm --cached <file>`. Add now the file to `.gitignore` and commit it. From now on future changes will not be tracked by Git.
