---
title: "NodeJS Azure Function with Toggl"
pubDate: 2018-03-25
description: "This article describes on how to build an Azure HTTP Function which will be triggered by the Geofency App which is available on the App Store."
author: "Aaron Czichon"
tags: ["Javascript", "Development"]
---

## Metadata for this article

```
NodeJS Version: 8.x.x
Time to read: about 7 minutes
```

This article describes on how to build an Azure HTTP Function which will be triggered by the Geofency App which is available on the App Store.

## Base story

For this tutorial I need to provide some background information. In our startup we’re using [Toggl](https://toggl.com) for time tracking. Privately I’m using the App [Geofency](http://www.geofency.com/) for tracking location times for spot I’m visiting often. So now I had the problem that I often forgot to stop my Toggl timer after a day of work.
The good thing about that is, that Toggl provides an REST API and Geofency supports web hook triggers.

![Screenshot: Microsoft Azure Dashboard](https://directus.aaronczichon.de/assets/374e0df3-96dc-4d63-b097-3080c5b6a567?download)

The problem with the Toggl API is, that you have to make 2 calls for stopping the timer:

1. You need to check if there is currently a timer running. If so, the API will return the time entry in the results.
2. You need the time entry id for stopping the timer

So that’s the point where Azure Function get into it.

## Creating the Azure Function

Before you could start developing the Azure Function you need to create it on the Azure Portal.
If you don’t have an Azure Account, you can create one here: [Microsoft Azure](https://azure.microsoft.com/en-us/free/).

For create a new Azure Function App, click on the `Create a resource` , `Compute` and on `Function App`:

![Screenshot: Creating azure function app](https://directus.aaronczichon.de/assets/ec518f97-fbb6-4ecd-8f83-5822c4bfc1e1?download)

Now you need to define an app name. Let’s call it `GeofencyTrigger` for example. Select your subscription, create a new resource group (`GeofencyTriggerGroup`), maybe change the server location under `Location` to a place which is nearer to you.
Hit `Create` if you’re all set:

![Screenshot: Azure function app configuration](https://directus.aaronczichon.de/assets/b4654ba3-afb4-43e9-b279-e2bcc95e1387?download)

The deployment process could take a while.
After it was successfully deployed on Azure you can access your Azure Function App:

![Screenshot: Adding new trigger to azure function](https://directus.aaronczichon.de/assets/ea6f9d7e-f38d-4cf6-947e-a351720237e0?download)

At the last step for programming preparations we want to create the HTTP trigger for our app. So click on `Functions` and on the blue plus symbol for adding a new function.
Select `Webhook + API` and choose `Javascript` as the function language:

{images:5}

That’s it for the setup. You now have successfully created a `Hello World` NodeJS Azure Function. Next step is about implemented the function itself.

## Developing the Azure Function

First of all we need to create project folder. Let’s call it `GeofencyFunctions`.
In this folder we’re going to run `npm init` for create a `package.json` file.
No we’re adding the `index.js` file which will contains our function.
This file should export our default function which will be triggered by Azure Functions.

```js
// index.js

module.exports = function (context, req) {
  // TODO
};
```

`context` and `req` are parameters which are automatically provided by Azure Functions. These could also be changed by configuring the `function.json` on the Azure Portal:

```json
// function.json

{
  "disabled": false,
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

Hint: In this `function.json` you could also configure which exported function the Azure Function trigger should call if you have more than one exported function in you `index.js`.

So in the next step we want to make a request to the REST API of Toggl. First of all we need the URL which gives us the current running time entry. This is the following URL:
`https://www.toggl.com/api/v8/time_entries/current`

For making http requests easier with NodeJS I’m going to use the package `request`. This could be installed with `npm`:

```bash
npm install request --save
```

So first we’re going to import the `request` package:

```js
// index.js
let request = require(“request”);

module.exports = function(context, req) {
	// TODO
}
```

Now we need to write the function which get’s the current time entry on Toggl.

```js
// index.js
...

function stopToggl(context, req) {
	request(`https//www.toggl.com/api/v8/time_entries/current`,
		(error, response, body) => {
			const timeEntry = JSON.parse(body);
		});
}
```

So now that we got the time entry, we may need to check if it has data. The Toggl API will return `null` if no timer was running. If there is no data specified we could quit the function and return a success call because we don’t need to stop anything.

```js
// index.js
...

			const timeEntry = JSON.parse(body);
			if (!timeEntry.data) {
				context.res = {
					body: timeEntry
				};
				context.done();
				return;
			}
...
```

We now have forgot an important thing. Toggl has multiple options to authenticate through their API. One simple method is using Basic Authentication.

Fo simplicity I’ll pass the username and password through parameters to the Azure Function later. So we need to get these parameters and pass them to the Toggl API.
The simplest approach is to add them to the `request` package request.

```js
// index.js
...
function stopToggl(context, req) {
	const username = req.query.username;
  const password = req.query.password;
	request(`https//${username}:${password}@www.toggl.com/api/v8/time_entries/current`,
		(error, response, body) => {
			const timeEntry = JSON.parse(body);
...
		});
}
```

Now the next step will be stopping the timer. In the previous step we checked if the time entry has valid data. Now we need to handle these data and pass the id of the entry to another API request to Toggl.
If this request runs successfully, the result could be passed as a result of the Azure Function:

```js
// index.js
...
request.put(`https://${username}:${password}@www.toggl.com/api/v8/time_entries/${timeEntry.data.id}/stop`, (err, response, body) => {
	const resultEntry = JSON.parse(body);

  context.res = {
  		// status: 200, /* Defaults to 200 */
      body: resultEntry
  };
  context.done();
});
...
```

So the complete function should look like this:

```js
// index.js
let request = require("request");

module.exports = function (context, req) {
  stopToggl(context, req);
};

function stopToggl(context, req) {
  const username = req.query.username;
  const password = req.query.password;
  request.get(
    `https://${username}:${password}@www.toggl.com/api/v8/time_entries/current`,
    (error, response, body) => {
      const timeEntry = JSON.parse(body);

      if (!timeEntry.data) {
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: timeEntry,
        };
        context.done();
        return;
      }

      request.put(
        `https://${username}:${password}@www.toggl.com/api/v8/time_entries/${timeEntry.data.id}/stop`,
        (err, response, body) => {
          const resultEntry = JSON.parse(body);

          context.res = {
            // status: 200, /* Defaults to 200 */
            body: resultEntry,
          };
          context.done();
        },
      );
    },
  );
}
```

## Run the function

At the last point we should now `deploy` the function to Azure Function. You could at least upload the `index.js` file or copy the code into the online editor and save it there. I’ll just copy it now for this tutorial:

![Screenshot: program code of index.js](https://directus.aaronczichon.de/assets/2db8446a-b9ea-4e0c-9412-1cc4308439e2?download)

Also click on the plus to add a new file called `package.json`. Copy your `package.json` content here and hit save.

```json
// package.json
{
  "name": "GegofencyTrigger",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "request": "^2.85.0"
  }
}
```

There is now one step left. As you may remember we’re installed the `request` package before using `npm`. This package is now obviously missing on Azure Functions.
For installing the Node packages you need to go to the `scm`package of your function. In my case the URL of my Function App is: `https://geofencytrigger.azurewebsites.net/api/...`
So the `scm` portal is: `https://geofencytrigger.scm.azurewebsites.net`.

Select the `Debug console` and then `CMD` in the main menu. Now you can see your function file system. Change to the function directory. In my case this would be:

```bash
cd site/wwwroot/HttpTriggerJS1
```

Now install your packages here. This could take a while:

```bash
npm install
```

After this is finished, you should see a `node_modules` folder in your Function directory. Now you’re all set!

You can now test your function using the function URL from portal and adding your `username` and `password` as a parameter to the function:

```
https://geofencytrigger.azurewebsites.net/api/HttpTriggerJS1?code=YOUR-AZURE-ACCESS-CODE&username=sample@gmail.com&password=my_passw0rd
```

Best,
Aaron
