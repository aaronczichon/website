---
title: "Astro: Automatically translate text during build time using DeepL"
pubDate: 2024-06-24
description: "A simple Astro component to automatically translate content during build time"
author: "Aaron Czichon"
tags: ["Development", "Work"]
---

If you're using Astro for one of your projects and creating a multi language website you may want to translate some parts automatically.  
With DeepL's API you can send text to the API and get the translated text in return. For this scenario I created a simple Astro component which can be used to automatically translate into a given language. Let's call it `DeeplTranslate`:

```jsx
---
import * as deepl from "deepl-node";
const authKey = import.meta.env.DEEPL_API_KEY;

const { render, has } = Astro.slots;
const { sourceLang, targetLang } = Astro.props;

const translateText = async (text: string) => {
  const translator = new deepl.Translator(authKey);
  const result = await translator.translateText(text, sourceLang, targetLang);
  return result.text;
};

let html: string = "";
if (has("default")) {
  html = await render("default");
  html = await translateText(html);
}
---

<Fragment set:html={html} />
```

With this component you can use something like this, e.g. in your MDX or other Astro component files:

```html
<DeeplTranslate sourceLang="de" targetLang="en-US"
  >Guten Morgen!</DeeplTranslate
>
```

This results into the rendered part:

```
Good morning!
```

It's especially useful if you write your blogposts with MDX. You can now wrap your text inside this component and it will be automatically translated into the given language.
