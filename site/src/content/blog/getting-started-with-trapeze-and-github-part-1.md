---
title: "Getting started with Trapeze and Github (Part 1)"
pubDate: 2022-11-28
description: "It gives a short introduction for the core concepts of Trapeze in connection with Github Actions. We'll cover which benefits it's providing and how you can use it.
Part 2 (coming later) will cover a more detailed version of the Trapeze configuration including .plist and Manifest manipulation."
author: "Aaron Czichon"
tags: ["Development"]
---

## What you can expect from this article?

It gives a short introduction for the core concepts of Trapeze in connection with Github Actions. We'll cover which benefits it's providing and how you can use it.
Part 2 (coming later) will cover a more detailed version of the Trapeze configuration including `.plist` and Manifest manipulation.

## Introduction

The Trapeze configuration is a new configuration library for building and managing your mobile applications.
If you're developing a whitelist application or an application which should be configured by an CI/CD pipeline you often need to deal with different types configuration. Depending on the distribution platforms like iOS and/or Android this can get complicated very soon.

The Ionic team has build a new library called Trapeze (or also known as Capacitor Configure before) which should handle the configuration of mobile projects.  
This should take place in the development platform which has previously served by the Cordova project. Some developers are missing the configuration options from Cordova in their Capacitor projects.  
The good news is, that the Ionic team takes care of them with Trapeze. The even better news is: It's not only working with Capacitor projects it's also working with native projects (Xcode, Kotlin), Flutter, Electron and more!

Example: In this article I'll cover some Trapeze functions and benefits by using an existing Ionic Capacitor application.

## Getting started

To add Trapeze to your existing project it's easy as everything in the Ionic universe: `npm install @trapezedev/configure`. It's that simple!

_Hint_: Make sure you have a correct `JAVA_HOME` environment variable set so Trapeze can find the correct Java installation for Android support.

With Trapeze there are 2 ways to configure your project: With `YAML` configuration files or using the Javascript/Typescript API which is provided by the `@trapezedev/project`.

![Red and blue pill image from The Matrix](https://directus.aaronczichon.de/assets/92d70441-56ce-4ac1-aef8-5190ec2bdd5a?download)

To get now started with a configuration a `config.yaml` file needs to be created inside the project.

```yaml
platforms:
  android:
    versionName: 1.3.1
  ios:
    version: 1.3.1
```

In this example the Android version name and the iOS version are getting updated to `1.3.1`.

As you can see my current application has a version called `1.3.0`.

![Screenshot: Apple XCode](https://directus.aaronczichon.de/assets/486823cb-a031-4e27-80a6-49758269f76e?download)

For taking the Trapeze configuration to action I'll run:

```bash
npx trapeze run config.yaml --android-project android --ios-project ios/App
```

This specifies the used configuration file (which is `config.yaml` in my case) and also specifies the native projects for Android and iOS (which are the defaults for a Capacitor app in this case).
The command first lists everything which is going to change and asks se if I want to apply them:

```bash
run android versionName 1.3.1
run ios version 1.3.1
updated ios/App/App.xcodeproj/project.pbxproj
updated android/app/src/main/AndroidManifest.xml
updated android/app/build.gradle
updated ios/App/App/Info.plist
[?] Apply changes?
    Applying these changes will modify your source files. We recommend committing any changes before running this
    operation.
? Apply? › (y/N)
```

After applying the changes the native projects got updated and where good to go with our new versions.

For better understanding I created a public Github repository which has the changes I've done to a simple demo application: [Github - Aaron Czichon Ionic Demo App](https://github.com/aaronczichon/aaronczichon-ionic-demo).

The changes of the Demo app adding the Trapeze package and configuration can be found in this [commit 5c58ce4](https://github.com/aaronczichon/aaronczichon-ionic-demo/commit/5c58ce4d89ca927c16c8a273848d8d6a1db5c74e).

## Automate package build with Github Actions

Before we continue with Trapeze in combination with CI/CD systems I'll make a short break and cover some Github Action things.

Github has, with the Action workflows, a system for building and deploying applications.
Sometimes it can annoying or challenging building the mobile apps every time locally. Especially if there are multiple developers involved an/or you often switch your development computer. In this cases you have to setup the full toolchain every time on every developer machine.

The better and more reliable way is to setup a CI/CD pipeline which handles the building and packaging.

For the demo part I'll setup the CI/CD for iOS application for now. For this you need to make sure to have the following information:

- A valid Apple developer account
- A valid iOS application created in your Apple developer account
- A bundle ID (I picked `com.aaronczichon.mobile` for my project)
- Your team ID
- A valid mobile provisioning profile as base 64 string
- A exported certificate including key and secret as base 64 string

Here is a sample of a Github Workflow which builds the iOS App and attaches the `.ipa` file as an artifact:

```yaml
name: Bundle iOS App

on:
  push:
    branches:
      - "main"

jobs:
  bundle-app:
    name: Build & Bundle App
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm i
      - run: npx trapeze run config.yaml -y --ios-project ios/App
      - run: npm run build
      - run: npx cap sync ios
      - uses: yukiarrr/ios-build-action@v1.5.0
        with:
          project-path: "ios/App/App.xcodeproj"
          p12-key-base64: ${{ secrets.P12_KEY_BASE64 }}
          p12-cer-base64: ${{ secrets.P12_BASE64 }}
          certificate-password: ${{ secrets.P12_CER_PASSWORD }}
          mobileprovision-base64: ${{ secrets.PROVISIONING_PROFILE }}
          code-signing-identity: ${{ secrets.CODE_SIGNING_IDENTITY }}
          team-id: ${{ secrets.TEAM_ID }}
          workspace-path: "ios/App/App.xcworkspace"
          export-method: app-store
          configuration: Release
          output-path: App.ipa
      - uses: actions/upload-artifact@v3
        with:
          name: iOS.ipa
          path: App.ipa
```

As you may already notice: We have also a relevant Trapeze command inside the workflow:

```shell
npx trapeze run config.yaml -y --ios-project ios/App
```

This one is nearly same as the example above but in this case just for the iOS platform.

The second part is now to add also the android platform build to the workflow.
To support this I'll rename the `bundle-app` job to `bundle-ios-app` and adding a new job for the android build:

```yaml
	bundle-android-app:
		name: Build & Bundle Android App
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v3
			- uses: actions/setup-node@v3
			with:
				node-version: 16
			- run: npm i
			- run: npm run build
			- run: npx cap sync android
			- uses: sparkfabrik/android-build-action@v1.2.0
			with:
				project-path: android
				build-type: assemble
				output-path: App.apk
			- uses: actions/upload-artifact@v3
			with:
				name: App.apk
				path: App.apk
```

For simplification I'll not signing the Android app here for the demo.

_Hint_:
From Apple you mostly get your certificates and/or provisioning profiles as files. Github needs them as bae64 string (so you can add them to your secrets).
To convert a file into a base 64 string you can use this command:

```shell
openssl base64 -in [SOME_FILE_PATH_HERE] -A
```

## Automatically increment build number with Trapeze

As Trapeze currently only sets a static version number and bundle identifier it can do more for you. Example handling the automatic increment of the build number (version code) for your application.

First of all we need to define a new environment variable inside our `config.yaml` at the beginning of the file for Trapeze:

```yaml
vars:
  GITHUB_RUN_NUMBER:
    default: 1
```

`GITHUB_RUN_NUMBER` is a special environment variable which is set by Github Actions during runtime and is automatically increased per workflow.  
The `default` is just a default value which is used if the `GITHUB_RUN_NUMBER` variable is not provided.

As a next step I'll add also the option for updating Android (which we're not using now but still make it configurable for the future).
So that we don't have to provide the package name (`com.aaronczichon.mobile`) twice, once for iOS and once for Android, we're moving it also to an environment variable:

```yaml
vars:
  GITHUB_RUN_NUMBER:
    default: 1
  PACKAGE_NAME:
    default: com.aaronczichon.mobile
```

Afterwards we're adding the Android platform and also we're adding new files for `buildNumber` (iOS) and `versionCode` (Android) which later uses the auto-incremented build run number from Github:

```yaml
platforms:
  android:
    packageName: $PACKAGE_NAME
    versionName: 1.0.0
    versionCode: $GITHUB_RUN_NUMBER
  ios:
    version: 1.0.0
    targets:
      App:
        buildNumber: $GITHUB_RUN_NUMBER
        bundleId: $PACKAGE_NAME
```

Our new full Trapeze configuration should look like this now:

```yaml
vars:
  GITHUB_RUN_NUMBER:
    default: 1
  PACKAGE_NAME:
    default: com.aaronczichon.mobile

platforms:
  android:
    packageName: $PACKAGE_NAME
    versionName: 1.0.0
    versionCode: $GITHUB_RUN_NUMBER
  ios:
    version: 1.0.0
    targets:
      App:
        buildNumber: $GITHUB_RUN_NUMBER
        bundleId: $PACKAGE_NAME
```

**What does this configuration do in a nutshell?**

- It defines 2 environment variables for the Trapeze context, both with default values
- It provides configurations for 2 platforms (iOS and Android)
- Both platforms have the version `1.0.0`
- Both platforms getting the Github Actions run number as version code / build number using the environment variable
- The identifier for the app is set to the `PACKAGE_NAME` environment variable with the value `com.aaronczichon.mobile`

If we now running the pipeline on Github it will inject the workflow number into our packages, update the bundle identifier / package name and add them as output to the workflow run:

![Screenshot: Github Artifacts](https://directus.aaronczichon.de/assets/b2139c1e-13a3-457b-8b0d-510f8807e5e8?download)

This was it for part 1!

In the second tutorial for Trapeze I'll cover on how you can inject specific frameworks, update `.plist` files and change the Mainfest file.

If you have any feedback, let me know via Twitter or Mastodon.

Best,
Aaron
