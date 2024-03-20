---
title: "Zoom DOM elements with CSS"
pubDate: 2020-12-20
description: "How to zoom a DOM element or even a complete HTML document without using the scaling function of the browser? I found a solution for a particular problem I had..."
author: "Aaron Czichon"
tags:
  [
    "Javascript",
    "CSS",
    "Web Development",
    "Element zoom"
  ]
---

Yes, I'm frontend developer but maybe Javascript developer would be more accurate because I'm not using CSS that much.

You may now think: Oh wait, why? In the past I would have answered because I don't like it but actually that's not the truth. It's more a thing that I mostly had worked in projects where we had explicit designers which are also have done the HTML markup and styling.   
In the past 1 year, especially in the last 6 months I got more familiar with CSS. Mostly because of layouting with Flexbox and CSS Grid isn't that hard (if you not coming from the "old" layouting of CSS).

So yes, I'm familiar with CSS and got the basics. But sometimes you're searching for a solution to your problem and you'll suprised how something works and how it's possible.

The case is, that I had to develop an application for a customer where we get a complete HTML document from an API which need to be rendered in full on our application. It's some sort of a preview for a later, backend generated document on a backend engine.

The preview panel in our application should render the HTML document. The preview should also have two additional functions: zooming the document in and zooming the document out.

Ok, I was familiar with zooming images, PDFs or HTML Canvas. But how should I zoom a complete HTML document which shouldn't change it stylings element heights and widths and keeping the markup correct so I can use it later to sent it back to the backend without changing it's visual style?

Initially I thought about using the browser zoom in, zoom out funtion. This has the problem that it's actual not zooming the content it's more like scaling the content. Works like the scaling on a high resolution display.

## Building the demo case

Building the case. Let's create our app. In our case it's a simple website with plain JS.
```html
<!-- index.html -->
<!DOCTYPE html>
<html>

<head>
  <title>Zooming Sample</title>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <script src="main.js"></script>

  <div class="container">
    <div class="item"></div>
    <div class="item"></div>
  </div>

</body>

</html>
```
```css
/ * styles.css */
.container {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 1;
  height: 600px;
  width: 100%;
}

.item {
  grid-row: 1;
  width: 100%;
  height: 100%;
}
```
The `main.js` is empty for now. It now a simple page with a CSS grid that has two `div`s inside which are rendered side-by-side:
{images:1}

So that's status quo. Now let's add our HTML document from the API. To simplify the case, I will write some HTML Elements inside the `div` where using to zoom it.   
Let's say we have some table with contents, like an invoice for example. I'll also add some border to the CSS grid to make it more visible.
Extending the `.item` class in `styles.css` with:
```css
border: 1px solid black;
```
and adding a table with sample invoice data to the `index.html`:
```html
...
<div class="item">
      <table>
         <tr>
           <th>Position</th>
           <th>Description</th>
           <th>Price</th>
           <th>Quantity</th>
           <th>Sum</th>
         </tr>
         <tr>
           <td>1</td>
           <td>Workshop</td>
           <td>89€</td>
           <td>3</td>
           <td>267€</td>
         </tr>
         <tr>
           <td>2</td>
           <td>Javascript Support</td>
           <td>78€</td>
           <td>6</td>
           <td>468€</td>
       </tr>
    </table>
</div>
...
```

Now our table looks like this:
{images:2}

Asuming now we want to zoom the table without chaning it's layout fitting to the CSS grid. And here starts the cool part:   
You can actually scale an element without chaning it's initial layout with a simple CSS extension:
```css
.zoom-to-50 {
  zoom: 0.5;
  -moz-transform: scale(0.5);
  -moz-transform-origin: 0 0;
  -o-transform: scale(0.5);
  -o-transform-origin: 0 0;
  -webkit-transform: scale(0.5);
  -webkit-transform-origin: 0 0;
}
```
For Firefox we need to make a little workaround using the transform function as they not supporting `zoom` out of the box (see also on [Can I Use](https://caniuse.com/?search=zoom)).
If we now add this class `zoom-to-50` to our table `<table class="zoom-to-50">` we are able to zoom our table element without changing it's layout:
{images:3}

So here the possibilities of this trick:
If you're using some frontend framework like React, VueJS, Angular or something else you mostly have binding options to the markup. In Angular for example you have RxJS where you can build an Observable which can you provide the zooming CSS depending on which zoom button (`+` or `-`) the user has clicked.   
With this option you can easily build an zoom function for your frontend application where you can zoom in and out of HTML elements.

In our project we use it even further and show the generated HTML document inside an iFrame. Into this iFrame we inject the zoom CSS with an Observable so we can zoom in and out the complete HTML document.

Sample project can be found here on my [Github](https://github.com/Inoverse/aaronczichon.de/tree/master/CSS_Zooming).

Hope this helps someone who may have a similar problem :)

Best,
Aaron