---
title: "Ionic and Firebase Authentication"
pubDate: 2017-03-07
description: "Learn how to implement simple OAuth authentication into a mobile app using the authentication provider of Firebase."
author: "Aaron Czichon"
tags: ["Development", "Javascript"]
---

## Metadata for this article

```
Ionic Version: 3.9.2
AngularFire2 Version: 5.0.0-RC.4
Angular Verson: 5.0.0
Firebase Version: 4.5.0
Time to read: about 12 minutes
```

## What do you learn in this article?

- Creating a new Ionic 2 app with connection and setup of firebase
- Creating a login and signup page
- Login and signup using firebase backend

## Where do I find the sample project?

You can find the sample project on my Github page: [Ionic 2 and Firebase Authentication Sample Project](https://github.com/Inoverse/aaronczichon.de)

## Introduction into Firebase

![Firebase Logo](https://f001.backblazeb2.com/file/aaronczichon-de/ionic-firebase-authentication/firebase_logo.png)

Firebase is a realtime database which focuses on delivering and saving data for client apps. Firebase was founded in 2011 and was acquired by Google back in 2014. Since this time Firebase is a part of the Google developer platform. Started as a simple realtime database, firebase is now a way more. It has evolved as a realtime backend.
Also an important component is the Firebase authentication. This module unifies many OAuth provider and classical e-mail / password as one authentication service.
With this module the developer is able to handle every user the same way, unnecessary which login / signup method they have used. With this options the user is able to link multiple authentication methods to one user account.

Another benefit of this authentication backend is, that you don’t have to struggle with your backend, because you don’t need any additional backend. Resetting password via email or confirmation of signup is already integrated in Firebase and is configurable in the console.

The main focus of firebase is, that you don’t need an additional backend for your mobile and/or web app. Firebase targets front end and app developer along with startups and company which won’t manage a backend infrastructure.

This article is an introduction into authentication using firebase with email and password. We want to create a new Firebase console project and a new Ionic 2 project. Our content of the Ionic app should only be visible if the user is logged on and authenticated. The signup at Firebase should also be implemented into this Ionic app along with the login.

## Create and setup a Firebase project

First of all, if you want to start with Firebase, you need a valid Google account. For creating a new project you need to switch to the [Firebase Console].
This console provides an overview of your existing project, links to the documentation, sample codes and API. There are two options of creating a new project. First, creating a entirely new project and second, importing an existing Google Cloud Project.

![Screenshot of the firebase dashboard](https://directus.aaronczichon.de/assets/a6d72743-c75e-40b2-ac6c-53776d207b96?download)

In this example, we create a complete new Firebase project. The name of the project can be chosen by you. In our example we will call it “IGWorkshops”.

![Screenshot: create new firebase project](https://directus.aaronczichon.de/assets/c3a5619f-d097-4abc-bf33-f5eef15705cf?download)

After the successful initialisation of the project, the console redirects you to the overview of the new project. On the left side of the project you can find important features for this project. On the right side of the project name you can find the project settings.

![Screenshot: firebase project settings](https://directus.aaronczichon.de/assets/aa23d8e6-8a95-4c98-a4c4-10d2db81d2ff?download)

The most necessary informations and security options can be found there. For example, there you can find the project ID and the Web API Key.

In the first step we want to enable authentication using email and password. For this option you have to enable the corresponding authentication provider at the authentication settings under `Sign-In Method`.
For this settings switch to `Authentication->Sign-In Method` and choose the edit button behind `Email/Password`. By switching the `Enable` toggle you will enable the authentication via email.

For now the first configuration of firebase is all set.

## Creating a new Ionic project

For using the Firebase authentication we have to create our client. We now going to create a new Ionic app, we’ll call it `IGWorkshops`:

```bash
ionic start IGWorkshops blank --v2
```

The Ionic CLI now generates automatically a new Ionic project and runs the `npm install` command.

![Screenshot: NPM install](https://directus.aaronczichon.de/assets/4b92aaa9-133f-4c2b-a176-95db0c8b872a?download)

Hint: For developing with Ionic you have to install `NodeJS` and the Ionic CLI (`npm install -g ionic`).

### Usage of Firebase inside an Ionic app

There are several options for using Firebase inside your Ionic 2 application. For example, if you only need the database functionality you can use it with common HTTP request. But if you want to use the complete range of functionality there is an suggestion to use the Firebase Web SDK. Currently the SDK doesn’t support Angular 2 neither Typescript. In this case we going to use a the [AngularFire2].
For sure, you can use the Firebase Web SDK without AngularFire2 but it helps a lot with extended function e.g. at the authentication process.

### Adding Firebase and AngularFire2

For adding AngularFire2 to the Ionic project, switch to the Ionic project with your terminal/command line. Both dependencies, AngularFire2 and Firebase Web SDK, are available as npm packages.

```bash
npm install firebase angularfire2 --save
```

That’s for the install. For the usage you have to add a few configuration settings to your Ionic application to make it work with Firebase. This will shown you in the next section ‘Implementation’.

## Implementation

The implementation has three main parts. Creating the pages for login and signup, implementing signup and implementing login.

### Login and Signup

For our login and signup process we need two new pages inside our Ionic app. You can create them manually or automatically by using the Ionic Generator which is build in the Ionic CLI.
For using the generation switch to the terminal inside your Ionic project and create two new pages:

```bash
ionic generate page login
ionic generate page signup
```

Now you have to add these two new generated pages to the standard module of your Ionic app.

```ts
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  declarations: [MyApp, HomePage, LoginPage, SignupPage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, LoginPage, SignupPage],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StatusBar,
    SplashScreen,
  ],
})
export class AppModule {}
```

As mentioned before, we have to do a little bit of configuration for your Ionic app to use the AngularFire2 module.
This module also has to be added to the App-Module, like our new generated pages. Also you need the credentials and keys for accessing your Firebase project.
The credentials for our project can be found inside the Firebase Console. Select your project (in our case `IGWorkshops`) and navigate to the project settings. Inside the `General` tab you can find a button calling “Add Firebase to your web app”:

![Screenshot: adding web platform](https://directus.aaronczichon.de/assets/390d7794-e98d-4914-8c86-cc177c19e626?download)

On click an dialog pops up, where you have to copy the `config` variable with all it’s properties. Switch now back to your Ionic app.

Inside your Ionic app now import AngularFire2 into `app.module.ts` and provide the credentials into the initialisation, which you copied before. Now your app module should look like this:

```ts
// app.module.ts
import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";

var config = {
  apiKey: "<YOUR-PERSONAL-API-KEY>",
  authDomain: "<YOUR-PROJECT>.firebaseapp.com",
  databaseURL: "https://<YOUR-PROJECT>.firebaseio.com",
  storageBucket: "<YOUR-PROJECT>.appspot.com",
  messagingSenderId: "<YOUR-MESSAGE-ID>",
};

@NgModule({
  declarations: [MyApp, HomePage, LoginPage, SignupPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, LoginPage, SignupPage],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    StatusBar,
    SplashScreen,
  ],
})
export class AppModule {}
```

Now we have to implement the validation if a user is logged on or not. If he is authenticated the app should show him the `HomePage`. If the user is not logged on, he should be redirected to the `LoginPage` which also have a link to the `SignupPage`. On this page a user is able to signup at Firebase for a new account.

First of all we have to implement the validation. This happens inside the `app.component.ts`. For this we’re going to extend the constructor with AngularFire2 call on the authentication implementation. This call subscribes to authentication changes. If the authentication is changed, we’re going to check if the user is authenticated or not.

Hint: AngularFire2 uses mostly the observable pattern and RxJS. If you don’t now how these observables are working, please read the documentation of [RxJS] and get familiar with it.

Now you have to import AngularFire2 and the LoginPage into our `app.component.ts`. We also provide the corresponding instance inside the constructor and implementing the subscription. The subscription should redirect the user to the. `HomePage` if the auth response is valid and the user authenticated. If he is not authenticated, the subscription should redirect to the `LoginPage`.

```ts
// app.component.ts
import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";

import { AngularFireAuth } from "angularfire2/auth";
import { LoginPage } from "../pages/login/login";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    private afAuth: AngularFireAuth,
    private statusBar: StatusBar,
    private splashscreen: SplashScreen,
  ) {
    this.afAuth.authState.subscribe((auth) => {
      if (!auth) this.rootPage = LoginPage;
      else this.rootPage = HomePage;
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashscreen.hide();
    });
  }
}
```

Now we have successfully implemented the difference between an authenticated and none authenticated user. Before we start implementing the logon and signup process, we need a UI for this. Also we need the link from logon to signup.
For the UI we will change the markup of `login.html` and implementing the corresponding properties and functions into `login.ts`.

```html
<!-- login.html -->
<ion-header>
  <ion-navbar>
    <ion-title>Login</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>
  <ion-list>
    <ion-item>
      <ion-label floating>E-Mail</ion-label>
      <ion-input type="email" [(ngModel)]="loginData.email"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label floating>Password</ion-label>
      <ion-input type="password" [(ngModel)]="loginData.password"></ion-input>
    </ion-item>
  </ion-list>
  <button full ion-button (click)="login()">Login</button>
  <a href="#" (click)="signup()">Signup for an Account</a>
</ion-content>
```

```ts
// login.ts
import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { SignupPage } from "../signup/signup";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
  loginData = {
    email: "",
    password: "",
  };
  constructor(public navCtrl: NavController) {}

  login() {
    // Login Code here
  }

  signup() {
    this.navCtrl.push(SignupPage, { email: this.loginData.email });
  }
}
```

The `signup` function redirect to the `SignupPage` and provides, if available, the email address which was entered by the user inside the email field of the `LoginPage`. In this case the user have not to reenter the email address on the `SignupPage`.

The markup of the `SignupPage` looks pretty familiar to the one of the `LoginPage`. The differences are that in the `SignupPage` we have two password fields (for retyped passwords) and the logic of `signup.ts` is different.
The two password fields are going to be checked if the entered passwords are matching each other to avoid typos. If the passwords do not match, the user get’s an error dialog.

```html
<!-- signup.html -->
<ion-header>
  <ion-navbar>
    <ion-title>Signup</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>
  <ion-list>
    <ion-item>
      <ion-label floating>E-Mail</ion-label>
      <ion-input type="email" [(ngModel)]="signupData.email"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label floating>Password</ion-label>
      <ion-input type="password" [(ngModel)]="signupData.password"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label floating>Re-Enter Password</ion-label>
      <ion-input
        type="password"
        [(ngModel)]="signupData.passwordRetyped"
      ></ion-input>
    </ion-item>
  </ion-list>
  <button full ion-button (click)="signup()">Signup</button>
</ion-content>
```

```ts
signup.ts;
import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
})
export class SignupPage {
  signupData = {
    email: "",
    password: "",
    passwordRetyped: "",
  };

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
  ) {
    this.signupData.email = this.navParams.get("email");
  }

  signup() {
    if (this.signupData.password !== this.signupData.passwordRetyped) {
      let alert = this.alertCtrl.create({
        title: "Error",
        message:
          "Your password and your re-entered password does not match each other.",
        buttons: ["OK"],
      });
      alert.present();
      return;
    }

    // Firebase Signup Code
  }
}
```

Now we implements the function to signup a new user by using the already added AngularFire2 module. The user should be able to register using an email and password combination.
If there is an error during the signup process (e.g. with a too short password), the app should show a dialog with the error message.
So you going to implement AngularFire into `signup.ts` first.

```ts
import { AngularFireAuth } from "angularfire2/auth";
```

and

```ts
constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth) {
	    this.signupData.email = this.navParams.get('email');
	  }
```

If you want to start the signup process on button click, we need to implement the process inside the `signup` function. Inside this function we’re going to use a function of AngularFire which is called `createUser` and passing the needed parameters (email and password).

```ts
this.afAuth.auth
  .createUserWithEmailAndPassword(
    this.signupData.email,
    this.signupData.password,
  )
  .then((auth) => {
    // Could do something with the Auth-Response
  })
  .catch((err) => {
    // Handle error
  });
```

If the signup was successful and you have not configured a confirmation using email, AngularFire will automatically logon your user and returns the auth response. If the logon was successful, our previous implementation of the auth subscription is going to be triggered and redirects the user directly into the `HomePage`.

If there was an error with the signup, our code will run into the `catch` statement. The firebase error response has two properties.

```ts
error = {
  code: string,
  message: string,
};
```

The error response from firebase always looks the same, so we have now two options to handle the error. First we could use the `message` property as message for the user and showing it directly to him. Second we could use the `code` property for getting, eg. a translation key and showing the translated value to the user.
This example is going to use the `message` property to show the message directly to the user by using a alert box.

```ts
let alert = this.alertCtrl.create({
  title: "Error",
  message: err.message,
  buttons: ["OK"],
});
alert.present();
```

![Screenshot: Mobile app with password length error](https://directus.aaronczichon.de/assets/ddfab856-d8c9-4291-9db3-6907c9015327?download)

If the signup was successful the user get’s redirected to the `HomePage`.

![Screenshot: Empty mobile app after login](https://directus.aaronczichon.de/assets/2c20214f-3b5d-486b-a13b-e235bfe6bae3?download)

The `SignupPage` is finished now. Here is the complete code.

```ts
// signup.ts
import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
})
export class SignupPage {
  signupData = {
    email: "",
    password: "",
    passwordRetyped: "",
  };

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
  ) {
    this.signupData.email = this.navParams.get("email");
  }

  signup() {
    if (this.signupData.password !== this.signupData.passwordRetyped) {
      let alert = this.alertCtrl.create({
        title: "Error",
        message:
          "Your password and your re-entered password does not match each other.",
        buttons: ["OK"],
      });
      alert.present();
      return;
    }

    // Firebase Signup Code
    this.afAuth.auth
      .createUserWithEmailAndPassword(
        this.signupData.email,
        this.signupData.password,
      )
      .then((auth) => {
        // Could do something with the Auth-Response
        console.log(auth);
      })
      .catch((err) => {
        // Handle error
        let alert = this.alertCtrl.create({
          title: "Error",
          message: err.message,
          buttons: ["OK"],
        });
        alert.present();
      });
  }
}
```

We’ve implemented the option for signup a user. Now we have to implement the ability to authenticate a existing user at Firebase. This will happen inside the `LoginPage`.
First of all we have to extend the `login` function like the `signup` function. Also we should import the required modules of AngularFire which are, in this case, `AngularFire`, `AuthMethods` and `AuthProviders`.

```ts
import { AngularFireAuth } from 'angularfire2/auth';

constructor(private navCtrl: NavController, private afAuth: AngularFireAuth) { }
```

Now we implement the authentication process of Firebase.

```ts
this.afAuth.auth
  .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
  .then((auth) => {
    // Do custom things with auth
  })
  .catch((err) => {
    // Handle error
  });
```

For logon at Firebase we have multiple options and provider possibilties. For each posibility there is a dedicated method.
In our case we're going to use the E-Mail and Password authentication. That's the reason why we're using the `signInWithEmailAndPassword` method.

Like on the `SignupPage` we also have the same error handling options during the authentication process. This time we don’t want to use an alert for showing the error. We’re going to implement a toast message for notifying the user about an error. For using toast messages we have to import the `ToastController` from the `ionic-angular` package.

```ts
import { NavController, ToastController } from 'ionic-angular';

constructor(private navCtrl: NavController, private afAuth: AngularFireAuth, private toastCtrl: ToastController) { }
```

Inside the catch block of the authentication process we’re now creating a new toast and present it on the view, showing the error message from Firebase.

```ts
let toast = this.toastCtrl.create({
  message: err.message,
  duration: 1000,
});
toast.present();
```

If something went wrong during the authentication process, the user gets notified by the toast.

![Screenshot: Login error message](https://directus.aaronczichon.de/assets/c0a195d8-2009-4608-9378-14c7fe5435a6?download)

This is how the code for `LoginPage` looks like.

```ts
// login.ts
import { Component } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { SignupPage } from "../signup/signup";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
  loginData = {
    email: "",
    password: "",
  };
  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
  ) {}

  login() {
    this.afAuth.auth
      .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
      .then((auth) => {
        // Do custom things with auth
      })
      .catch((err) => {
        // Handle error
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 1000,
        });
        toast.present();
      });
  }

  signup() {
    this.navCtrl.push(SignupPage, { email: this.loginData.email });
  }
}
```

Last but not least, we’re improving a few things according to the usability of the authentication and signup process. We only want to enable the submit button if we have filled email and password fields.
For this we only have to change a few things inside our HTML templates of the pages and extending them with a few Angular bindings.

```html
<!-- login.html -->
<button
  full
  ion-button
  (click)="login()"
  [disabled]="!loginData.email || !loginData.password"
>
  Login
</button>
```

```html
<!-- signup.html -->
<button
  full
  ion-button
  (click)="signup()"
  [disabled]="!signupData.email || !signupData.password || !signupData.passwordRetyped"
>
  Signup
</button>
```

## Adding sign out function (Update of July 2017)

As often requested I've added a sign out functionality to the sample project.
For implementing a logout you have to update your home template and component (page). First of all we're going to add a sign out button to the `home.html` template, which should now look like this:

```html
<!-- home.html -->
<ion-header>
  <ion-navbar>
    <ion-title> Ionic Blank </ion-title>
    <ion-buttons end>
      <button ion-button icon-only (click)="signOut()">
        <ion-icon name="power"></ion-icon>
      </button>
    </ion-buttons>
  </ion-navbar>
</ion-header>

<ion-content padding>
  The world is your oyster.
  <p>
    If you get lost, the
    <a href="http://ionicframework.com/docs/v2">docs</a> will be your guide.
  </p>
</ion-content>
```

Now we have to implement the `signOut` function inside our page which is called by the button. First we have to add the `AngularFireAuth` provider to our page. After that we add the `signOut` function which is calling the `signOut` function of the `AngularFireAuth` service. That's it! (Yes, it's that simple).

```ts
// home.ts
import { Component } from "@angular/core";

import { NavController } from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  constructor(
    private navCtrl: NavController,
    private auth: AngularFireAuth,
  ) {}

  signOut() {
    this.auth.auth.signOut();
  }
}
```

## Conclusion

In this article now you have learned how to create a new Firebase project, extending a Ionic app with AngularFire2 and how to implement a simple authentication and signup process using email and password. You’re now able to implement contextual content inside your app depending of authenticated and none authenticated users.

Feel free to ask questions in the comment section below. Before asking make sure you're using the same package versions like me (see meta information at the beginning of the article).

Greetings,
Aaron

## Changes on AngularFire2 Version 4.0.0-RC.1

As you may noticed, in the latest release of AngularFire2 we have to change a few things. I want to conclude some of the mayor changes:

1. We no longer have only one Angular module for AngularFire2. Instead, if we want to use authentication, we also have to add the `AngularFireAuthModule` to our `AppModule`.
2. There is now a new provider for authentication called `AngularFireAuth`.
3. Methods of the AngularFire authentication has changed. So no longer have a `login` function and the options to pass the authentication method and provider into it. There is now a `signIn` function for each authentication method. In our case this has changed to `signInWithEmailAndPassword`. This method name changes also concerns the `signUp` functions as you can see in our `signUp` page.

## Updated

Update from 17. December 2017:

- I updated the article to Ionic 3.9.2, Anuglar 5 and AngularFire2 5 RC4.
- Also in header you can now find all important version informations. (Ionic, Angular, AngularFire2, Firebase)
- Updated Conclusion section
- If you updating your project, check the packages for upgrade instructions (like [Ionic](https://github.com/ionic-team/ionic/CHANGELOG.md))
