---
title: Linting liquid files in javascript
date: 2016-04-18
tags: linting, jekyll
excerpt: "Scaling projects with static site generators can be pretty tough. Splitting content creation from the actual compilation is a usually a good first step. The latest project I was working on was an enterprise website, which was built with a rather extensive gulp pre-build steps and a Jekyll compilation step to generate the final html."
---

Scaling projects with static site generators can be pretty tough. Splitting content creation from the actual compilation is a usually a good first step. The latest project I was working on was an enterprise website, which was built with a rather extensive gulp pre-build steps and a Jekyll compilation step to generate the final html.

The split between content and compilation opened up the possibility to let the team of content creators write all their content in markdown and pass it through build steps into the Jekyll build. This step sped up creation of new pages drastically, while the developers were able to focus on styling and feature development. A couple of components of the site actually needed some special of markups, which required extending the markdown content files with special liquid tags.

The tech stack proved to be too extensive to install on the content creators machines locally, so we came up with a couple of tools and gadgets to make things easier for them. Since errors in liquid syntax can easily break the page and cause the Jekyll build to fail, I created a linter for the liquid files.

## The concept

Instead of recreating the syntax definition for liquid combined with markdown to analyze the content for potential errors, I took an approach I'd like to call "bruteforced linting". Making use of [liquid-node](https://github.com/sirlantis/liquid-node), an implementation of the liquid language in Nodejs, the linter tries to parse the string. If an error is encountered, instead of stopping the code, the error is logged into a global array and the section of the string is replaced by spaces. This way, the line numbers of the errors are still preserved for the final error log.

And here is the code:

~~~js
const Promise = require('bluebird');
const Liquid = require("liquid-node");
const engine = new Liquid.Engine;

var errors = [];
var allchecks = [];

const replaceProblemWithSpace = (chunk, err) => {
  const problemReg = /at (.*) /;
  const replacer = err.message.match(problemReg)[1];
  const replacee = replacer.replace(/.*/g, ' ');
  var replacedstring = chunk.split(/\n/g);
  var newlinestring = replacedstring[err.location.line-1];
  newlinestring = newlinestring.substring(0, err.location.col-1) + replacee + newlinestring.substring(err.location.col-1 + replacer.length, newlinestring.length);
  replacedstring[err.location.line-1] = newlinestring;
  return replacedstring.join('\n');
};

const parseChunk = (chunk) => {
  return engine
    .parse(chunk)
    .catch((err) => {
      errors.push(err);
      chunk = replaceProblemWithSpace(chunk, err);
      return parseChunk(chunk);
    });
};

const testString = fs.readFileSync(filepath).toString();
allchecks.push(parseChunk(testString));
Promise.all(allchecks)
  .then(() => callback(errors.reverse()));
~~~
