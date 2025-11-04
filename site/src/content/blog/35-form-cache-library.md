---
title: "Angular Form Cache Library"
pubDate: 2025-11-04
description: "Automatically cache and restore reactive form data your Angular application."
author: "Aaron Czichon"
tags: ["Development", "Work"]
---

Since June this year, I’ve been working with a new customer at PlanB. After developing and evolving a web application for another big customer of the company for 5 years (and 7 years at another company for the same customer), it was finally time for something new. The new project is great because we can define the technological decisions on our side and have started developing the new application from scratch. The main requirement from the customer is: We have this 25-year-old legacy app and want it with the same (but better) functionality as a web application.

The new project includes a lot of forms for different entities, and it’s built for users who need to document their day-to-day work in it.    
We also built a tabbed layout inside the app which enables the users to have multiple entities opened at once.    
Since our users have no technical background, they expect that if they close, for example, a form during edit and re-open it on the next day, the data is still there. It doesn’t matter if they closed the tab or shut down the computer.   

Angular‘s reactive forms are pretty powerful, but they don‘t persist data across tabs, windows, or page reloads.

For this situation (and many others), I developed a small library for Angular called `ng-form-cache`.    
It provides a set of services and a directive to cache data from reactive forms to storage, where it can later be read and restored to the form. By default, the data is saved to local storage, but as I built this as an internal service that can be overridden, everyone can change the storage behavior and save the data wherever they want.   
This library works out of the box with a single directive that needs to be applied to the `<form>` where the `formGroup` is set that should be cached. Everything else is handled automatically (including restore).   

To get started, add the GitHub registry to your `.npmrc` and install the library with:
```bash
npm install @planbgmbh/ng-form-cache
```

First, you need to import the directive into your component:
```typescript
imports: [ReactiveFormsModule, AutoSaveDirective],
```

Then you can apply the directive to your form:
```html
<form
  [formGroup]="form"
  fcAutoSave="user"
  fcObjectId="new"
  [fcAutoLoad]="true"
>
  <input formControlName="firstName" placeholder="First name" />
  <input formControlName="lastName" placeholder="Last name" />
  <input formControlName="email" placeholder="Email" />
</form>
```

That‘s it! It works out of the box and is usable directly without further configuration.
If you want to dig deep, you can override nearly every default setting for the library, such as the debounce time when the form gets saved, TTL for the cache, max quota for the storage, etc.
You can even use the FormPersistenceService to manage the drafts programmatically, e.g., if you want to clean up the draft after you submitted the form and stored the data.
The library supports storing multiple different form data based on the context and the provided object ID.
You can also initialize the library with a user ID so that the data in storage is scoped. This allows you to clean up the data after a logout.
If you like, you can also switch from local storage (default) to session storage or something built by yourself.

The library supports Angular 20+ and standalone applications only. It should work with module-based applications as well, but I don‘t provide official support for it.

You can find the full documentation on the [GitHub Pages documentation page](https://planbgmbh.github.io/pb-dpf-ng-form-cache-library/).

The library, for now, is not released as a v1 version, so it‘s still in early development, although we already use it for a customer (so it should be good to use).

The package is currently only available via GitHub‘s NPM registry and will be available on the official NPM registry soon.

Feel free to provide feedback on GitHub!

Best,
Aaron

P.S. The code will also be moved to Codeberg someday, and GitHub will only host the mirror — but more on that in the future.
