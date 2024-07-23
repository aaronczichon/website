---
title: "Sending FCM Push using Cloud Functions for Firebase"
pubDate: 2017-03-13
description: "With Firebase Cloud Messaging system there is an option to send push notifications through their service. Learn how to integrate them with a serverless function into an app."
author: "Aaron Czichon"
tags: ["Development", "Javascript"]
---

## Metadata for this article

```
Firebase CLI: 3.5.0
Time to read: about 10 minutes
```

Hint: `Cloud Functions for Firebase` are currently in beta state.

## What do you learn in this article?

- Setting up your Firebase project for Cloud Functions
- Creating first Cloud Function
- Implementing a function which sends push notifications through FCM if data is written to firebase
- Deploy function

## Where do I find the sample project?

You can find the sample project on my Github page: [Sending FCM Push using Cloud Functions for Firebase](https://github.com/Inoverse/aaronczichon.de).

## Introduction

Sometimes, if you are an Firebase developer you have a very similar problem to mine. You're writing data into the Firebase database and if data is written you want to send a push notification through FCM ([Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/)).  
The problem was, that you cannot directly send FCM messages triggered by a database event, so you have to develop an additional service, like a NodeJS server which handle this for you. On my point of view this was against the concept of Firebase. The main target of Firebase is replacing the backend for developers. So they only have to develop their frontend (web) app. Until now.  
At this year's [Google Next Conference](https://cloudnext.withgoogle.com), they announced Cloud Functions for Firebase. This is a huge step forward for Firebase, because we now have a way more possibilities for implementing new behaviours into our apps.

## Cloud Functions for Firebase

Cloud Functions for Firebase are part of Google Cloud and Firebase.
Cloud Functions are basically a node server running for your Firebase project which executes your written functions on specified triggers. If you had, until now, a custom NodeJS server which uses Firebase Admin SDK for detecting changes on the database and sending push, this is basically the same like the Cloud Functions for Firebase but without managing the NodeJS.

![Drawing, Firebase and NodeJS functions](https://directus.aaronczichon.de/assets/b9df94e2-c257-4a3d-9639-8ecd5b97e3d4?download)

In a Cloud Functions project you have one or more entry points (functions) which are executed by your trigger. Inside your function you could basically run everything which also runs inside NodeJS. But you have to keep in mind, that this functions are triggered by an event. After the function is executed the instance of this function is gone.
Following triggers are available in Cloud Functions for Firebase:

- Database Triggers (if data is changed inside the realtime database)
- Authentication Triggers (on user creation, sign ins, developer account creation, user deletion)
- Analytics Triggers (if an analytics event was triggered)
- Cloud Storage Triggers (on changing data inside cloud storage)
- HTTP Triggers (well, as the name says)
- Cloud Pub/Sub Triggers (triggered whenever a user for example subscribed to a topic)

For more information on Triggers, have a look into the [documentation](https://firebase.google.com/docs/functions/database-events).  
In this article we're going to use the database triggers.

## Setup your environment

Before we're able to write cloud functions, we have to install the Firebase CLI locally.

Hint: If you don't have installed NodeJS on your development machine, please install the latest [version](https://nodejs.org).

You could easily install the CLI using `npm`:

```bash
npm install -g firebase-tools
```

After the CLI was installed, sign in into your firebase account with this command:

```bash
firebase login
```

This should open up your browser and you have to sign in and allow access into your account. Now you're environment is all set.

## Setup the project

For our project we're going to reuse the project from the last article [Ionic 2 and Firebase Authentication](https://aaronczichon.de/2017/03/07/ionic-firebase-authentication/).
We're expecting that we have the following data inside your realtime database:

```json
{
  "projects": {
    "-Kf2Zi3rxFwrGUW6tJ7V": {
      "done": false,
      "title": "New Article on Website"
    }
  },
  "users": {
    "lP8Dd1ts8QMUj2wqi7vdPLOcYiG3": {
      "email": "aaron.czichon@webatlas-gbr.de",
      "pushToken": "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1..."
    }
  }
}
```

We have two types of objects: `projects` and `users`. Users are simple. The id is the UUID of the authenticated user and also the `email`. `pushToken` contains the registration token of the device which belongs to the user.
`projects` contains my current to dos with a title and a `done` flag which cloud be `false` (not yet done) or `true` (already done).

Now we want to use the Cloud Functions for Firebase to send a push notification to the user, every time a new project is added or the state (`done` flag) is changed.

## Creating and implementing cloud function

Before we're able to implement our cloud function, we have to create a new Firebase function project. To generate a new project, we're going to use the Firebase CLI.

```bash
firebase init functions
```

During the generation the CLI asks you a few things about your project. For example for which Firebase project you're going to implement these functions:

![Screenshot: CLI project selection](https://directus.aaronczichon.de/assets/e7dc919f-ac67-422c-9070-a68db92a0b4e?download)

Hint: If you're asked to install the node modules, answer with yes.

If everything went fine, you should get something like this:

```bash
✔  Firebase initialization complete!
```

If the project was successfully created it has generated a few files for you.

```bash
firebase.json
	functions
		package.json # Default npm configuration file
		index.js
		node_modules # Depdency Directory
```

`firebase.json` should be empty by default. This is the file for project properties which are maybe later needed during your implementation process.
`index.js` is your main source file for your cloud functions. In our case, we're going to implement our function here.

As you can see inside the `package.json` file, the Firebase CLI adds `firebase-functions` and the `firebase-admin` SDKs by default. You're now ready to handle your Firebase project by cloud functions.

![Screenshot: Firebase dashboard](https://directus.aaronczichon.de/assets/dde41cb1-ad0b-456e-a6ad-afa57541be7e?download)

We're switching now to the `index.js` file (inside the `functions` folder) and creating our first cloud functions.

```javascript
var functions = require("firebase-functions");

exports.sendPush = functions.database
  .ref("/projects/{projectId}")
  .onWrite((event) => {});
```

We call the first function `sendPush`. This functions uses the a database reference on the `projects` node of our database and triggers on a write action. So every time data inside the `projects` node of our database is changed this cloud function will be triggered.

Now we want to implement our functionality inside this function. First of all we're going to check, after the event was triggered, if the data exists before or if it's a new project. So we're accessing the the data on the `event` parameter. This `data` object has a property called `previous`. `previous` gets the node _before_ the current triggered change. It's a great possibility to check for changes on a node.

```javascript
let functions = require("firebase-functions");

exports.sendPush = functions.database
  .ref("/projects/{projectId}")
  .onWrite((event) => {
    if (!event.data.previous.exists()) {
      // Do things here if project didn't exists before
    }
  });
```

Before this check we're no going to read the changed or created data into a variable.

```javascript
let functions = require("firebase-functions");

exports.sendPush = functions.database
  .ref("/projects/{projectId}")
  .onWrite((event) => {
    let projectData = event.data.val();
    if (!event.data.previous.exists()) {
      // Do things here if project didn't exists before
    }
  });
```

Now we're going to extend the function with two new variables. One for the changes on the project state and one for a new created project.

```javascript
let functions = require("firebase-functions");

exports.sendPush = functions.database
  .ref("/projects/{projectId}")
  .onWrite((event) => {
    let projectStateChanged = false;
    let projectCreated = false;
    let projectData = event.data.val();
    if (!event.data.previous.exists()) {
      // Do things here if project didn't exists before
    }
  });
```

Now, if the project hasn't exists before, we're setting `projectCreated` to `true`.

```javascript
if (!event.data.previous.exists()) {
  projectCreated = true;
}
```

Next we're checking if the project state has been changed. For this we're using the current project data and the previous project data.
Hint: we have to handle, that the previous data might be undefined if the `projectCreated` property is `true`.

```javascript
if (!projectCreated && event.data.changed()) {
  projectStateChanged = true;
}
```

That's all for the decision if the write request was for a new project or a state change.

In the next step we now adding the Firebase Admin SDK which is already a npm dependency and initialize it. The benefit of the cloud functions are, that you don't have to setup the admin SDK because it's already running inside your Firebase project, so you simple import the config of Firebase Functions SDK.

```javascript
let admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
```

Before we start loading the users push token and sending the push notifications, we need to define the push messages. Inside our trigger functions after the decisions we're now implementing the messages for newly created projects and project state changes.

```javascript
let msg = "A project state was changed";

if (projectCreated) {
  msg = `The following new project was added to the project: ${projectData.title}`;
}
```

If the message for the user is all set, we're going to load the users push token. For this we're creating a new function.

```javascript
function loadUsers() {
  let dbRef = admin.database().ref("/users");
  let defer = new Promise((resolve, reject) => {
    dbRef.once(
      "value",
      (snap) => {
        let data = snap.val();
        let users = [];
        for (var property in data) {
          users.push(data[property]);
        }
        resolve(users);
      },
      (err) => {
        reject(err);
      },
    );
  });
  return defer;
}
```

This function, which returns all users, we're now calling from our event/trigger function.
After we called `loadUsers()`, inside the `then` return of the Promise, we're now sending the push notification.
First we create an array which contains all the push tokens.

```javascript
return loadUsers().then((users) => {
  let tokens = [];
  for (let user of users) {
    tokens.push(user.pushToken);
  }
});
```

So now we're able to use the Firebase Admin SDK for sending the push notifications.

```javascript
return loadUsers().then((users) => {
  let tokens = [];
  for (let user of users) {
    tokens.push(user.pushToken);
  }

  let payload = {
    notification: {
      title: "Firebase Notification",
      body: msg,
      sound: "default",
      badge: "1",
    },
  };
  return admin.messaging().sendToDevice(tokens, payload);
});
```

Hint: Every cloud function has to return a Promise because they are called asynchron.

Here is the full implementation of the cloud function.

```javascript
let functions = require("firebase-functions");
let admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendPush = functions.database
  .ref("/projects/{projectId}")
  .onWrite((event) => {
    let projectStateChanged = false;
    let projectCreated = false;
    let projectData = event.data.val();
    if (!event.data.previous.exists()) {
      projectCreated = true;
    }
    if (!projectCreated && event.data.changed()) {
      projectStateChanged = true;
    }

    let msg = "A project state was changed";

    if (projectCreated) {
      msg = `The following new project was added to the project: ${projectData.title}`;
    }

    return loadUsers().then((users) => {
      let tokens = [];
      for (let user of users) {
        tokens.push(user.pushToken);
      }

      let payload = {
        notification: {
          title: "Firebase Notification",
          body: msg,
          sound: "default",
          badge: "1",
        },
      };

      return admin.messaging().sendToDevice(tokens, payload);
    });
  });

function loadUsers() {
  let dbRef = admin.database().ref("/users");
  let defer = new Promise((resolve, reject) => {
    dbRef.once(
      "value",
      (snap) => {
        let data = snap.val();
        let users = [];
        for (var property in data) {
          users.push(data[property]);
        }
        resolve(users);
      },
      (err) => {
        reject(err);
      },
    );
  });
  return defer;
}
```

Deploy your function using the following CLI command.

```bash
firebase deploy --only functions
```

After a successful deployment, you should get something like this.

![Screenshot: CLI deployment terminal](https://directus.aaronczichon.de/assets/694cfe3c-fcb4-4d37-a45a-4fd7e20eeebf?download)

Hint: If you want to have a good logging, which is shown inside the `Logs` tab of your Firebase Console, add `console.log` statements to your cloud function.

Second Hint: According to the comment of Ovidiu Anghelina, I want you to know after deploying your functions you're able to fully manage them inside the [Google Cloud Dashboard](https://console.cloud.google.com/functions). Inside this dashboard for example you're able to test the function and you get better logging of error messages. You can also have a look at the function code of your project.

## Conclusion

You learned how to setup your environment for using the Firebase CLI and creating a new cloud functions project. You've implemented a new cloud function which handles changes on your realtime database and sending push notifications using Firebase Cloud Messaging for it.  
You now have the basic knowledge of how cloud functions works and your able to implement and use them in your own project.

Greetings,
Aaron
