---
title: "Ionic and Firebase Storage - Saving Images"
pubDate: 2017-04-18
description: "Combining Ionic and the Firebase service. Use the Firebase storage provider to save taken images and show them inside the app."
author: "Aaron Czichon"
tags: ["Ionic", "Firebase", "Storage", "Images"]
---

## Metadata for this article

```
Ionic Version: 3.4.1
Firebase SDK Version: 3.9.x
AngularFire2 Version: 4.0.0 RC1
Time to read: 10 minutes
```

## What do you learn in this article?

- Reusing the [Ionic - Firebase Authentication App](https://aaronczichon.de/2017/03/07/ionic-firebase-authentication/)
- Taking a picture with Ionic and saving it to Firebase Storage
- Showing all pictures in a grid

## Where do I find the sample project?

You can find the sample project on my Github page: [Ionic Firebase Image Upload](https://github.com/Inoverse/aaronczichon.de)

## Introduction

Before we start, a few words for this tutorial. In this tutorial we're going to reuse the created application with the corresponding Firebase project we've created in the [Ionic and Firebase Authentication](https://aaronczichon.de/2017/03/07/ionic-firebase-authentication/) article.

What does this mean?  
We'll in this article we've already created a new Ionic application, created a new Firebase project, added the Firebase and AngularFire2 SDKs and implemented the Firebase authentication.  
So we now have a working Ionic application with a Firebase authentication to signup and/or login a user and detect them.

Okay fine, so what's the actual status?  
So our application has the option to logon and/or signup a new user:

![Screenshot: Basic Ionic App with Login](https://directus.aaronczichon.de/assets/2fe7fdb0-bf33-4270-a534-3d731873e801?download)

If we've signed up or logged on with the Firebase authentication we where redirected to our `HomePage` of the application:

![Screenshot: Blank Ionic App](https://directus.aaronczichon.de/assets/4fbeea9d-011e-4ea4-813c-2c6c5fa88a77?download)

## Adding the camera plugin

Before we could start implementing the upload and taking the picture we need to add the camera plugin.  
We need to run two commands from the command line. One for adding the Cordova plugin to our project and one for installing the `npm` package of the Ionic Native plugin for the camera module.

```bash
ionic plugin add cordova-plugin-camera --save
```

And for the `npm` package:

```bash
npm install --save @ionic-native/camera
```

Hint: To avoid build and publishing errors on iOS because of missing camera usage description we need to provide this info at our `config.xml` for build times.  
Search for the `plugin` section where you can find the camera plugin. This should look like this:

```xml
<plugin name="cordova-plugin-camera" spec="~2.4.0">
        <variable name="CAMERA_USAGE_DESCRIPTION" value=" " />
        <variable name="PHOTOLIBRARY_USAGE_DESCRIPTION" value=" " />
</plugin>
```

Change it to:

```xml
<plugin name="cordova-plugin-camera" spec="~2.4.0">
		<variable name="CAMERA_USAGE_DESCRIPTION" value="IGWorkshops requires access to the camera for taking pictures which will be added to the users in-app library"/>
		<variable name="PHOTOLIBRARY_USAGE_DESCRIPTION" value="IGWorkshops requires access to the photo library for selecting images which will be added to the users in-app library"/>
</plugin>
```

Before we're able to use the camera plugin inside our application we have to add it to our application module in `app.module.ts`:

```js
// ...
import { Camera } from "@ionic-native/camera";
// ...
providers: [
  { provide: ErrorHandler, useClass: IonicErrorHandler },
  StatusBar,
  SplashScreen,
  Camera,
];
// ...
```

We've now successfully added the camera plugin to our application.

## Implementing the image provider

Before we're able to take a picture and upload it, we should implement the image provider which should handle two things:

- Uploading a new image as Base64 string to the users spaces
- Getting a image list from the users space

For creating a new provider we're using the Ionic CLI generator:

```bash
ionic generate provider imageProvider
```

This generates a new `image-provider.ts` file inside the `providers` folder. Before we add the functions we're adding the firebase SDK as an import and removing unnecessary things. The provider should now look like this:

```js
// image-provider.ts
import { Injectable } from "@angular/core";
import * as firebase from "firebase";

export class ImageProvider {
  constructor() {}
}
```

Now we create three function we going to need:

- uploadImage which will have a base64 string and the user id as parameter
- getImage which will have the user id and the image id as parameter
- generateUUID as a private function for generating UUIDs as the image name

```js
uploadImage(image: string, userId: string): any {
    // Implementation
  }

  getImage(userId: string, imageId: string): any {
    // Implementation
  }

  private generateUUID(): string {
    // Implementation
  }
```

The implementation of the `generateUUID` function is pretty simple. You just could copy this code:

```js
private generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
```

Before we could show some images, we should implement the uploader for a image. If you have worked with the Firebase SDK before the handling of the storage should be familiar to you. Like using the authentication or the database we have to create a storage reference.

```js
let storageRef = firebase.storage().ref();
```

If we now want to create a new image on this storage within the users space we need two parameters for the image reference. The userId (which is a parameter of the `uploadImage` function and a image name which will be a UUID.

```js
let imageName = this.generateUUID();
let imageRef = storageRef.child(`${userId}/${imageName}.jpg`);
```

Now we got our image reference on which we now put our image:

```js
return imageRef.putString(image, "data_url");
```

That's it. The image upload is now implemented. This is how your upload function should look like:

```js
uploadImage(image: string, userId: string): any {
    let storageRef = firebase.storage().ref();
    let imageName = this.generateUUID();
    let imageRef = storageRef.child(`${userId}/${imageName}.jpg`);
    return imageRef.putString(image, 'data_url');
  }
```

For downloading the image we need to implement the `getImage` function which needs the user id and the image id as parameter.  
Like the upload function we have to create a storage reference and a reference to the existing image. On the image reference we call the `getDownloadURL` function for getting the image URL. Your `getImage` function should look like this:

```js
getImage(userId: string, imageId: string): any {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child(`${userId}/${imageId}`);
    return imageRef.getDownloadURL();
  }
```

That's it for the `ImageProvider`! We're now able to upload images and show them inside your application.

Next is to take a picture and upload it.

## Taking picture and upload it

Before we implement the function for taking a picture and uploading it, we need a new button to open the camera. For this switch to the `home.html` file and add a new button and remove the other code inside the `ion-content` tag.

```html
<!-- home.html -->
<!-- ... -->
<ion-content padding>
  <button ion-button full (click)="takePicture()">Take Picture</button>
</ion-content>
```

The next step is to add the `takePicture` function to our page component.

```js
// home.ts
takePicture() {
	// Implementation
}
```

Inside the `home.ts` file we also need the dependency of the camera module. This should be added with an import statement and a dependency parameter inside the constructor. This is your `home.ts` now.

```js
// home.ts
import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { NavController } from 'ionic-angular';
import { Camera , CameraOptions} from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private camera: Camera
    ) { }

  takePicture() {
    // Implementation
  }
}
```

Inside the `HomePage` class we need an property for the camera options.

```js
// home.ts
// ...

cameraOptions: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE,
};

// ...
```

If we've created the camera options, we're now able to implement the `takePicture` function for taking the picture. Let's start with the picture taking part:

```js
// home.ts
// ...
takePicture() {
    this.camera.getPicture(this.cameraOptions)
      .then(data => {
        // Uploading here
      });
  }
```

It's only three lines for taking the picture. For a working upload we now need the image data as a Base64 string, so wee need to extend the image data with the correct schema.

```js
let base64Image = "data:image/jpeg;base64," + data;
```

Now we create a new array for the image ids inside our `home.ts` and also add the `ImageProvider` to our `app.module.ts` and the `home.ts`:

```js
// app.module.ts
// ...
import { ImageProvider } from "../providers/image-provider";
// ...
providers: [
  { provide: ErrorHandler, useClass: IonicErrorHandler },
  StatusBar,
  SplashScreen,
  Camera,
  ImageProvider,
];
// ...
```

```js
// home.ts
// ...
import { ImageProvider } from '../../providers/image-provider';
// ...
private images = [];
// ...
constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private camera: Camera,
    private imageSrv: ImageProvider
    ) { }
// ...
```

If all imports and declarations successful, we could implement the upload into the `takePicture` function and save the image name into the new image array. This array will be saved in the `localStorage`:

```js
takePicture() {
    this.camera.getPicture(this.cameraOptions)
      .then(data => {
        let base64Image = 'data:image/jpeg;base64,' + data;

        return this.imageSrv.uploadImage(base64Image, this.af.auth.getAuth().uid);
      })
      .then(data => {
        this.images.push(data.a.name);
        localStorage.setItem('images', JSON.stringify(this.images));
      });
  }
```

That's it! Image upload successfully implemented.

## Present the user images in a grid

The last step will be used to create a grid for all the users images that already has been uploaded. First we need to load the already saved image names from the `localStorage` inside our constructor of the `home.ts` file:

```js
let data = localStorage.getItem("images");
if (data) this.images = JSON.parse(data);
```

Next is to extend the template file (`home.html`) with a grid for the images.

```html
<!-- home.html -->
<!-- ... -->
<ion-content padding>
  <button ion-button full (click)="takePictureMock()">Take Picture</button>
  <ion-grid>
    <ion-row>
      <ion-col
        col-12
        col-sm-4
        col-md-3
        col-lg-2
        *ngFor="let image of imageUrls"
      >
        <img [src]="image" />
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-content>
```

Inside the page component `HomePage` we need to add the new array for the image urls.

```js
imageUrls = [];
```

Now we implement a new function `downloadImageUrls` which iterates through the `images` array and getting the right download URL for the image id. All these promises will be called and merged into an array with image urls:

```js
downloadImageUrls() {
    let promiseList = [];
    for (let i = 0; i < this.images.length; i++) {
      let promise = this.imageSrv.getImage(this.af.auth.getAuth().uid, this.images[i]);
      promiseList.push(promise);
    }

    Promise.all(promiseList)
      .then(urls => {
        this.imageUrls = urls;
        console.log(urls);
      });
  }
```

This method should now called after uploading a new image and after it was added to the image id list inside the `takePicture` function.

```js
takePicture() {
    this.camera.getPicture(this.cameraOptions)
      .then(data => {
        let base64Image = 'data:image/jpeg;base64,' + data;

        return this.imageSrv.uploadImage(base64Image, this.af.auth.getAuth().uid);
      })
      .then(data => {
        this.images.push(data.a.name);
        localStorage.setItem('images', JSON.stringify(this.images));
        this.downloadImageUrls();
      });
  }
```

Last we could add a second button for downloading the existing images without taking a new picture.

```html
<!-- home.html -->
<button ion-button full (click)="downloadImageUrls()">Show Images</button>
```

That's it. This is how your application should look like.

![Screenshot: Mobile app with two buttons for take a picture and showing them](https://directus.aaronczichon.de/assets/fbbe6034-598e-4562-9547-5ec177035c52?download)

## Conclusion

You now have learn how to take a picture as a Base64 string and working with the Firebase Storage. You now able to write and read data from Firebase Storage and using it for larger files.  
Now it's on your own if you extend your app with even more Firebase functionality for example by storing the image ids inside the Firebase Database rather than inside the `localStorage`.  
As always you can find the sample code at the [Github repository](https://github.com/Inoverse/aaronczichon.de).  
If you have any questions, let me now in the comment section below.

Best,
Aaron
