---
title: Creating a SVG color wheel
date: 2016-05-21
tags: svg, colorwheel
excerpt: "A couple of weeks ago I was tasked with updating the style and asset library in the company where I work. This asset library is presented and made available to everybody in the company as an internal web site, and the icon library alone grew in the last year from around 100 icons to more than 400 icons today."
draft: false
---

# Generating a SVG color wheel

A couple of weeks ago I was tasked with updating the style and asset library in the company where I work. This asset library is presented and made available to everybody in the company as an internal web site, and the icon library alone grew in the last year from around 100 icons to more than 400 icons today.
These icons exist as an SVG resource inside the library itself. To enable everybody in the company to use these icons, in any color needed, I created a little tool to convert them to any given color provided in the color guide.

Since there are about 80 brand approved colors in this list, this would have made a very long select box. That's why I decided to create a small color wheel in SVG to give quick access to every color available.

Here is an image of the finished color wheel:

![Finished color wheel](/assets/img/color-wheel-final.svg)


Since the brand colors were also subject to slight change, I chose to create the whole color wheel with javascript. This can be split into 3 simple creation steps:

### 1. Color circles

For every color group, we first create circles with increasing radii. To split them in equal sizes, we first need to evaluate, which of the color groups has the most and entries, which is pretty easy now:  

~~~javascript
let groupMaxSteps = 0;
Object.keys(colors).forEach((group) => {
  if(colors[group].length > groupMaxSteps) {
    groupMaxSteps = colors[group].length;
  }
});
~~~

With that value, we know the increment value of the radius each step. To create the circles in SVG, a root object is necessary. When creating svg elements with javascript, it is very important to create them with the SVG namespace. Otherwise they will not render correctly once they are added to the DOM.


~~~javascript
// create circles
const namespace = 'http://www.w3.org/2000/svg'; // namespace for SVG nodes
const colorwheel = document.createElementNS(namespace, 'svg');
colorwheel.classList.add('colorwheel');

// set the coordinate system and size of the viewBox to 0 0 100 00
colorwheel.setAttribute('viewBox', '0 0 100 100');    

// run through all color groups
Object.keys(colors).forEach((group) => {
  // create a group for the colors
  const groupelement = document.createElementNS(namespace, 'g');

  // run through the colorgroup backwards to have the lightest color inside
  for(let i = colors[group].length-1; i >= 0; i--) {

    // create a circle element
    const circle = document.createElementNS(namespace, 'circle');

    // set the center of the circle
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');

    // calculate the radius for the circle
    const radius = 50 / groupMaxSteps * i;

    // set the radius and the fill color
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', colors[group][i].hex);

    // append the circle to the color group
    groupelement.appendChild(circle);
  }
  // append the group to the root element
  colorwheel.appendChild(groupelement);
});
~~~

This is what the color wheel would look like, if there were only the gray colorgroup:

![Finished color wheel](/assets/img/color-wheel-gray.svg)

And the svg code matching it:

~~~xml
<svg class="colorwheel" viewBox="0 0 100 100">
  <g>
    <circle cx="50" cy="50" r="46.875" fill="#191919"></circle>
    <circle cx="50" cy="50" r="43.75" fill="#242424"></circle>
    <circle cx="50" cy="50" r="40.625" fill="#353535"></circle>
    <circle cx="50" cy="50" r="37.5" fill="#454646"></circle>
    <circle cx="50" cy="50" r="34.375" fill="#525252"></circle>
    <circle cx="50" cy="50" r="31.25" fill="#606060"></circle>
    <circle cx="50" cy="50" r="28.125" fill="#6d6d6d"></circle>
    <circle cx="50" cy="50" r="25" fill="#898989"></circle>
    <circle cx="50" cy="50" r="21.875" fill="#a0a0a0"></circle>
    <circle cx="50" cy="50" r="18.75" fill="#b7b7b7"></circle>
    <circle cx="50" cy="50" r="15.625" fill="#cccccc"></circle>
    <circle cx="50" cy="50" r="12.5" fill="#e6e6e6"></circle>
    <circle cx="50" cy="50" r="9.375" fill="#ececec"></circle>
    <circle cx="50" cy="50" r="6.25" fill="#f2f2f2"></circle>
    <circle cx="50" cy="50" r="3.125" fill="#f8f8f8"></circle>
    <circle cx="50" cy="50" r="0" fill="#fafafa"></circle>
  </g>
</svg>
~~~


### 2. Creating the clip paths

Svg clip paths are pretty powerful. You can simply mask whole groups with another path, which is exactly what was used to cut out the pie shapes of every color group. The `clipPath` element can contain any number of svg-shape definitions and is identified via the id. Within any other element, you can define a `clip-path` attribute and reference the defined shapes via an `url(#)`;

![Finished color wheel](/assets/img/color-wheel-maskoverlay.svg)

~~~xml
<svg class="colorwheel" viewBox="-50 0 200 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="gray-mask">
      <polygon points="50,50 98.54101966249684,14.732884862451598 110,49.999999999999986" fill="#ff2200"></polygon>
    </clipPath>
  </defs>

  <g clip-path="url(#gray-mask)">
    ...
  </g>
</svg>
~~~

To generate the circles via Javascript turned out to be pretty easy. Generating the triangular clip paths should have been also pretty easy, if I wouldn't have forgotten almost everything about basic trigonometry.

Here is what took me about an hour to figure out:   
Divide the 360° by the amount of color groups present which gives us an inner angle α. We have the center point A (which is at x:50/y:50) and the inner angle, which will let us calculate the points B and C with the following formula: X: length of the vector * cos(angle), Y: length of the vector * sin(angle), or in javascript:

~~~js
// 50 is the center point of the svg viewBox
// 60 an arbitrary length that will let the clippath reach outside the viewBox
const endpointBx = 50 + 60 * Math.cos(angle);
const endpointBy = 50 + 60 * Math.sin(angle);
~~~

![color wheel angles](/assets/img/color-wheel-angles.svg)

### 3. Repeat and mix

Mixing this all together and iterate over a rather large list of colors and you will end up with sth like this:

<p data-height="314" data-theme-id="light" data-slug-hash="VaRgZM" data-default-tab="result" data-user="Haroldchen" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/Haroldchen/pen/VaRgZM/">SVG Colorwheel</a> by Thomas Heller (<a href="http://codepen.io/Haroldchen">@Haroldchen</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
