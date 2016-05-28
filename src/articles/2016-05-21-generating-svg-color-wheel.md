---
title: Creating a SVG color wheel
date: 2016-05-21
tags: svg, colorwheel
---

A couple of weeks ago I was tasked with updating the style and asset library in the company where I work. This asset library is presented and made available to everybody in the company as an internal web site, and the icon library alone grew in the last year from around 100 icons to more than 400 icons today.
These icons exist as an SVG resource inside the library itself. To enable everybody in the company to use these icons, in any color needed, I created a little tool to convert them to any given color provided in the color guide.

Since there are about 80 brand approved colors in this list, this would have made a very long select box. That's why I decided to create a small color wheel in SVG to give quick access to every color available.

Here is an image of the finished color wheel:

![Finished color wheel](/images/2016-05-21-generating-svg-color-wheel/color-wheel-final.svg)


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

![Finished color wheel](/images/2016-05-21-generating-svg-color-wheel/color-wheel-gray.svg)

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
