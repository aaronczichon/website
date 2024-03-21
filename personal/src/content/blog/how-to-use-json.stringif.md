---
title: "How to use JSON.stringify"
pubDate: 2020-09-28
description: "An easy and extended way to use JSON.stringify method."
author: "Aaron Czichon"
tags: ["Javascript", "JSON", "Web Development"]
---

I bet every Javascript developer has used `JSON.stringify` before. So you definitely know how to make an Javascript object into a JSON string.

So far so good. I lately had the use case to show an object, which was return by an API inside an code editor, similar to Visual Studio Code. I need to get more information on how the `JSON.stringify` API works.

If you use the default behavior of the JSON method you may get a result like this:

```js
// First definingy an object
const profileData = {
  firstName: "Aaron",
  lastName: "Czichon",
  profile: "https://github.com/aaronczichon",
  website: "https://aaronczichon.de",
};
// Now run JSON.stringify
const result = JSON.stringify(profileData);
// Result
// "{\"firstName\":\"Aaron\",\"lastName\":\"Czichon\",\"profile\":\"https://github.com/aaronczichon\",\"website\":\"https://aaronczichon.de\"}"
```

The main problem now is, that you can't read the JSON string now as a human. If you want to show it the user in the frontend in a code editor it will always look like in VS Code:

![Screenshot: VSCode](https://directus.aaronczichon.de/assets/fd49f40d-3190-4605-9b7c-35649ee50398?download)

So if you know have a large object it's nearly unreadable for the user.

The `JSON.stringify` has additional, optional parameters which can be passed.

```js
// replacer defines the option where you can
// replace strings or characters before returning the stringified object.
// The space defines which space should be added to the keys and values.
JSON.stringify(profileData, replacer, space);
```

So if you want to show the stringified object with a space of 2 like in VS you can add these additional parameters to the function call:

```js
// Now run JSON.stringify
const result = JSON.stringify(profileData, null, 2);
// Result
// "{ // \"firstName\": \"Aaron\",
//     \"lastName\": \"Czichon\",
//     \"profile\": \"https://github.com/aaronczichon\",
//     \"website\": \"https://aaronczichon.de\"
// }"
```

That's way better, isn't it?

Next step, we may want to manipulate the object itself before we generate the output string.

Assuming that we want to remove the `htttps://github.com/` part of every profile URL.

```js
const profileData = {
  firstName: "Aaron",
  lastName: "Czichon",
  profile: "https://github.com/aaronczichon",
  website: "https://aaronczichon.de",
};
// Now run JSON.stringify
const result = JSON.stringify(
  profileData,
  (name, val) => {
    if (name === "profile") val = val.replace("https://github.com/", "");
    return val;
  },
  2,
);
// Result:
// "{ // \"firstName\": \"Aaron\",
//    \"lastName\": \"Czichon\",
//     \"profile\": \"aaronczichon\",
//    \"website\": \"https://aaronczichon.de\"
// }"
```

That's pretty awesome, that we can now replace things before transforming it into a JSON string, but we can go even further. What if we want to show only the name of the profile object and removing the other properties? It would be awesome if we can filtering properties before we create the string. As the replacer accepts an array of properties, we can use this to return only the requested properties:

```js
const profileData = {
  firstName: "Aaron",
  lastName: "Czichon",
  profile: "https://github.com/aaronczichon",
  website: "https://aaronczichon.de",
};
// Now run JSON.stringify
const result = JSON.stringify(profileData, ["firstName", "lastName"], 2);
// result
// "{
//    \"firstName\": \"Aaron\",
//    \"lastName\": \"Czichon\"
// }"
```

This is some awesome functionality which is available on the `JSON.stringify` API and I love it. It makes manipulating JSON and string export of objects more convenient and easier to use.

Pro Tipp:

If you want to `stringify` an object which also contains functions, which doesn't work in `JSON.stringify` you can filter for functions inside your replacer function!

Best,
Aaron
