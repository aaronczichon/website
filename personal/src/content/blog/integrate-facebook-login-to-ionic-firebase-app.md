---
title: "Integrate Facebook Login to Ionic Firebase App"
pubDate: 2017-08-03
description: "Learn how to integrate the native Facebook login into your Ionic Firebase application."
author: "Aaron Czichon"
tags: ["Ionic", "Firebase", "Facebook", "Login", "Authentication"]
---

## Metadata for this article

```
Firebase CLI: 3.9.1
Ionic Framework Version: 3.6.0
Ionic CLI Version: 3.7.0
Time to read: 9 minutes
```

## What do you learn in this article?

- Reusing an existing Ionic App with Firebase
- Setup Facebook-App for using Facebook-Login
- Connect Firebase and Facebook to use Facebook-Login
- Extend Ionic App for using Facebook Login

## Where do I find the sample project?

You can find the sample project on my Github page: [Add Facebook-Login to Ionic App using Firebase](https://github.com/Inoverse/aaronczichon.de).

## Introduction

Before we could start we do a short recap. For this tutorial we're going to use an existing Ionic project which uses Firebase already. The project we're going to use was created in the [Ionic and Firebase Authentication](https://aaronczichon.de/2017/03/07/ionic-firebase-authentication/) tutorial which I've created earlier this year.
So before we start I assume that you got the following things already:

- An Ionic App which uses AngularFire2
- An existing Firebase project which can be used for this tutorial
- The Ionic App has E-Mail/Password authentication implemented

If you haven't these things already done, you can download the starting project from [Github](https://github.com/Inoverse/aaronczichon.de/tree/master/IGWorkshops).

## Setup a Facebook App

Before we can start implementing the Facebook provider into our app, we need to create a new Facebook App.
To create a new Facebook App you should be registered with your Facebook Account as a developer and switching to the [Facebook Developer Portal](https://developers.facebook.com).

If you're logged in, select "Add a new App".

![Screenshot: create new facebook app](https://directus.aaronczichon.de/assets/9cdd005f-d040-4ed4-8951-f245b0df4e2c?download)

In the Facebook popup enter a display name (mostly the name of your app) and a contact email address:

![Screenshot: facebook app dashboard](https://directus.aaronczichon.de/assets/d495a3ca-f5b6-4ac3-926a-9cd48c1262a2?download)

In the security popup you need to resolve the captcha and it creates your app.
If your app was created and Facebook redirected you to your app, you have to select "Facebook Login" to add the login functionality to your app.
Now you need to switch to your Firebase console, into our project and add Facebook as an authentication provider.

Enable Facebook als authentication provider. You need to enter your Facebook `App ID` and `App` secret here to Firebase. These two keys can be found in your Facebook app under `settings`:

![Screenshot: facebook app dashboard](https://directus.aaronczichon.de/assets/2a43b236-3cc9-49ee-a86c-32b9ef1a36a2?download)

After entering the `App ID` and the `App secret` you need to copy the Firebase redirect URL and hit `save`.

![Screenshot: facebook app dashboard](https://directus.aaronczichon.de/assets/089c3a52-36e1-407c-b937-6c17f9fb47a9?download)

The redirect URL from Firebase should now be entered into your Facebook app. So switch back to the Facebook Developer Portal, click on `Facebook Login` under `Products` and enter the redirect URL into the `Valid OAuth redirect URIs` field. After this hit `Save Changes`.

![Screenshot: facebook redirect url](https://directus.aaronczichon.de/assets/ea06b43d-bebd-42fa-b9f4-85e0c5707cb3?download)

Also we need to add this redirect URL to the Facebook app platform. For this, select `Quickstart` on the left side menu and select `Web` as platform. Enter your redirect URL and hit `Save`.

![Screenshot: facebook account linking](https://directus.aaronczichon.de/assets/e031182e-1dab-4b93-aab3-7dfc0023139e?download)

Now your Facebook app is nearly finished. We come back to that later.

## Setup Ionic App with Facebook Login on the Web

There are now two main ways we have to implement for using Facebook login.  
First, we implement the option to login using Facebook if our app is running in the browser. Second, implementing the usage of the Cordova plugin to use Facebook login on mobile devices.

So let's start with the web version. At first we need to add a Facebook login button to our application and the corresponding method in our component.

So in our `login.html` we add a new button:

```html
<button full ion-button (click)="loginFacebook()">Login with Facebook</button>
```

And a new, empty method to our `login.ts`:

```javascript
loginFacebook() {
	// Login code goes here
}
```

So far, so good. In our `login.ts` we already added the `AngularFireAuth` provider from the previous tutorial. Now we also need to import the Firebase SDK directly:

```javascript
import * as firebase from "firebase/app";
```

Now we're able to implement the `loginFacebook` method by using Facebook as authentication provider:

```javascript
loginFacebook() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .then((res) => console.log(res));
  }
```

If you now start your app locally with `ionic serve` and hit the `Login with Facebook` button, you should be redirected to Facebook, submit the OAuth and redirected back to your application:

![Screenshot: Web browser Ionic app mit console statement](https://directus.aaronczichon.de/assets/50e1e924-312a-4807-86f2-136d3b4b65c2?download)

After successful sign in, you should see the credentials in the debugging console:

![Screenshot: facebook make public](https://directus.aaronczichon.de/assets/3fdd6fa7-6a23-4221-acf8-c5d7275a6132?download)

That's it for now. Next is implementing the mobile Cordova plugin.

## Adding the Cordova Facebook Plugin to your app

For using the Facebook login also on your mobile device, you need to add a Facebook Cordova plugin. First you need to add, if you haven't already, a mobile platform e.g. `ionic cordova platform add android`.
Now you are able to add the Facebook plugin:
`ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="123456789" --variable APP_NAME="myApplication" --save`.

Make sure you provider the correct `APP_ID` and the correct `APP_NAME`. The App Name is the display name of the Facebook app (without spaces). In my case this should look like this:
`ionic cordova plugin add cordova-plugin-facebook4 --variable APP_ID="1383067751814949" --variable APP_NAME="aaronczichon.de" --save`.

After adding the Cordova plugin, you should now see this additional information in your `config.xml`:

```xml
<plugin name="cordova-plugin-facebook4" spec="^1.9.1">
        <variable name="APP_ID" value="1383067751814949" />
        <variable name="APP_NAME" value="aaronczichon.de" />
    </plugin>
```

To use this plugin now, we need to add the related `Ionic Native` plugin. You could use `npm` or `yarn` for handling packages:
`npm install --save @ionic-native/facebook`

To be able to use this native plugin you have to add the Facebook provider to our `app.module.ts`. This should look like this:

```javascript
// ...
import { AngularFireAuthModule } from "angularfire2/auth";
import { Facebook } from "@ionic-native/facebook";

// ...

@NgModule({
  // ....
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StatusBar,
    SplashScreen,
    Facebook,
  ],
})
export class AppModule {}
```

For implementing this usage now, we switching to our `login.ts` and importing the Facebook provider and the `Platform` from `ionic-angular` package.
This are now the `import` statements in this component:

```javascript
import { Component } from "@angular/core";
import { NavController, ToastController, Platform } from "ionic-angular";
import { SignupPage } from "../signup/signup";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { Facebook } from "@ionic-native/facebook";
```

We also need to provide the provider to the component using dependency injection:

```javascript
constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private facebook: Facebook,
    private platform: Platform
  ) { }
```

For the last code implementation we're now going to change our `loginFacebook` method. This will be extended with a platform detection and using the Facebook Cordova plugin:

```javascript
signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }
```

That's for the coding part. One last thing is now left.
For using the Facebook Cordova plugin we need to switch to the Facebook Developer Portal and enable the corresponding login platform (in our case Android).

So, switch to the Portal, select `Facebook Login` and `Quickstart`. There you should select the platform `Android`.

![Screenshot: android project information](https://directus.aaronczichon.de/assets/855ccb9d-bac1-48c5-b325-a0f52402c5d6?download)

In `Download the Facebook SDK for Android` click on `Next`. Also click `Next` for `Import the Facebook SDK`.
Now, in `Tell Us about Your Android Project` enter your package name (could be found in `config.xml` as id). E.g. `com.webatlas.aaronczichon`.
In `Default Activity Class Name` also enter this package name and extend it with the name of your application which could also be found in `config.xml`. In my case this would be:
`com.webatlas.aaronczichon.IGWorkshops`.

Hint: If your app has spaces in it's name just remove them for the `Default Activity Class Name`.

![Bild von einem smartphone mit einem facebook login](https://directus.aaronczichon.de/assets/2e6810cf-54ae-44ab-a3a0-e26392ed7ba7?download)

Hint: If Facebook is asking you, that they have a problem verifying the package name with Google just click `Use this package name`.

Hint: If you enable the `iOS` platform, click `Next` on the first two steps and on `3. Add your Bundle identifier` enter the same package name which you can find in `config.xml` as `id`.

And last but not least we have to enable our Facebook application. For this go to your Facebook app, `App Review` and set `Make aaronczichon.de public?` (but with your app name) to `Yes`. Choose a category and select `Confirm`.

{images:11}

That's it! You have successfully added Facebook Login to your application!

Connect your testing device and run the application on your device using `ionic cordova run android`.

{images:12}

Here is the full code of the `login` files:

```javascript
// login.ts
import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginData = {
    email: '',
    password: ''
  }
  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private facebook: Facebook,
    private platform: Platform
  ) { }

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then(auth => {
        // Do custom things with auth
      })
      .catch(err => {
        // Handle error
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000
        });
        toast.present();
      });
  }

  signup() {
    this.navCtrl.push(SignupPage, { email: this.loginData.email });
  }

  loginFacebook() {
    if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }
}
```

## Conclusion

We now have an Ionic application which can use Firebase email and password or Facebook as authentication provider. All users (also Facebook users) will now be available inside Firebase.

Because we implemented both, Cordova mobile plugin and the web platform we can run our application on mobile devices (iOS, Android and Windows) and also, for example, as Progressive Web App.

The full sample project can be found [here on Github](https://github.com/Inoverse/aaronczichon.de/tree/master/Ionic_Facebook_Firebase).

Best regards,
Aaron
