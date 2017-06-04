---
title: A-maze Ball | A small matter.js game
date: 2017-05-31
tags: matter.js, game, side-project
excerpt: "A small game built with matter.js and the deviceOrientation API"
---

Everyone who has worked with me for more than a week knows, that I love starting side projects. Due to my personal lack of focus, I rarely get around to finishing them. One could consider not following things to a desirable end as a character flaw. I'd like to focus on the positive side of that. I find joy in planning things out, doing research on problems and topics I'm not familiar with yet. I love getting to know new things.

Quite recently I have come to the conclusion, that not everything I start needs to be finished, nor perfect for that matter, [to share it](http://www.thomasheller.net/demos/maze-ball/). About two weeks ago, I have learned of a little library called [matter.js](http://brm.io/matter-js/). It is a small library for 2D physics "simulation" which came in handy for a project I wanted to try for some time now. You might be familiar with the wooden labyrinth games. The ones where you had to tilt the board a certain way to guide a small metal ball into the hole:

![Labyrinth example](https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Labyrinth_of_Failure.jpg/1920px-Labyrinth_of_Failure.jpg)
Image by Kim Navarre from Brooklyn, NY, USA


## Setting up matter.js

The architecture of the matter.js library is something you need to get used to. There are a couple of top-level objects you need to create or instanciate. 

```js
const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Events = Matter.Events;
const engine = Engine.create();

const render = Render.create({
  element: document.getElementById('canvas'),
  engine: engine,
  options: {
    hasBounds: true,
    wireframes: false,
    background: '#454546',
  }
});
```

These objects hold all manipulation functions connected to their respective context, i.e. to add an object to the world, you would call `Matter.World.add(engine.world, [bodies])`. 

## Getting the gyro data

You can check if the browser supports the deviceorientation API with this little piece of code:

```js
if (window.DeviceOrientationEvent) {
 console.log("I can haz deviceorientation");
}
```

This does not guarantee that there will be actual deviceorientation events fired by the system. Without any sensors installed, there will be no events fired.

The event includes properties holding the rotation of the device: Alpha, beta and gamma values. You can use them to apply a force to the ball, which will move the ball in the direction. Since the values passed are in degrees and rise too for the matter.js force scale, they needed to be tuned down by a factor.

```js
handleDevicemotion(e) {
  if (!e) return;
  if (e.beta) {
    this.leftright = e.beta / this.FACTOR;
  }
  if (e.gamma) {
    this.updown = e.gamma / this.FACTOR;
  }
};
//...
updateState(e) {
  this.ball.applyForce(this.updown, this.leftright);  
}
```


## Maze generation

There are a large number of maze generation algorithms out there. A lot of them are being covered by [Jamis Buck in his article](http://weblog.jamisbuck.org/2011/2/7/maze-generation-algorithm-recap.html) about maze generation. There are also a lot of interactive / step-by-step visualisations on how the algorithms work and what kind of maze they generate.

For my quick prototype, I chose the recursive backtracking algorithm, because it seemed to be the easiest to put in place. The algorithm digs through a random wall of the current position and checks if there is a passage to another position already there. If it is, it stops, if there is not, it will continue on. Every position in the 2D-array will receive a value by the algorithm, given it's recursive nature.

## Summary

It feels good to "finish" a small project like this. There are of course a thousand things in my mind what could be done with this prototype to have it improved. Graphics, better UI and a better level generation. Right now the start and end position are always chosen at random, which will lead to very easy levels.

One way to tackle this particluar problem is to generate a lot of levels via an API. Then have an A-star algorithm find the distance between the start and the endpoint of the maze and compare them to each other. With the stored data and the random-seeds, you could create increasing the challenge by every level.

If you have any suggestions or thoughts you could either [create an issue ](https://github.com/tomheller/maze-ball/issues) or hit me up on twitter [@Haroldchen](https://twitter.com/Haroldchen).

[Link to the game](http://www.thomasheller.net/demos/maze-ball/)