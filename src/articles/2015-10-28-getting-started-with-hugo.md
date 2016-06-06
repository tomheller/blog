---
title: Getting started with hugo
date: 2015-10-28
tags: static site generators  
excerpt: "Static site generators are a great tool to quickly build or mock up a website. I really love them and have tested myself through a couple of them already. There is one major downside, that almost all of them have. They are ridiculously hard to set up for people who do not have a development background. This might not bother you if you are using them to create your own sites, but if you need to deliver a website to a client, who - god forbids - wants to edit his content himself, you are a little bit screwed."
---

Static site generators are a great tool to quickly build or mock up a website. I really love them and have tested myself through a couple of them already. There is one major downside, that almost all of them have. They are ridiculously hard to set up for people who do not have a development background. This might not bother you if you are using them to create your own sites, but if you need to deliver a website to a client, who - god forbids - wants to edit his content himself, you are a little bit screwed.
Jekyll and Middleman and a lot of their friends are based on ruby, which again is great if you working on MacOS. I dare you to try and talk a client, who is not as tech saavy, through a jekyll installation on windows. Believe me, I've been there. Here is the gist of it:

* Install Ruby, but make sure it is the right version. No (easy) rvm on windows
* Install the RubyDevkit
* Register the RubyDevkit with your ruby installation. (Console commands are scary)
* Install the jekyll gem (again, console is scary)

Also not everyone is happy with running some commands to develop their content. In the end I ended up preparing .bat files for every step of the way to make things easier, but it is still a hassle.

## Introducing gohugo.io

Hugo is an open source static site generator built by [Steve Francia](http://spf13.com/) and all of [these fine folks](https://github.com/spf13/hugo/graphs/contributors). It does almost everything you could need for a quick small site. And the very best thing, it is amazingly easy to install. On windows, you just need to drop the hugo binary into your projects folder, and you are good to go. On MacOS, homebrew is supported and a couple of other Linux distributions have a [copy and paste install solution](https://gohugo.io/overview/installing/) ready for you.

## First steps with hugo

Hugo brings a couple of scaffolding features within. Simply run the following command and hugo builds the project structure.

~~~ shell
hugo new site /path/to/site
~~~

Afterwards just head over to your the created folder and run the following:

~~~ shell
hugo server -w
~~~

This will boot up an adhoc webserver and run the compiled website on http://localhost:1313/ also continuously watching for any changes and live reloading the page in the browser.

## The config

There are a lot of things you can configure on a per site basis in a toml or yaml config file. You gain a lot from defining a baseurl in the default config. Hugo will replace the basedomain with http://localhost:1313 when started with a serve flag. Additionally, you have a lot of options with linking files inside the templates by just referencing the file within your project and it will build the correct link. \{\{"main.css" \| relURL\}\} will output you http://thomasheller.net/css/main.css.
One little catch you should be aware about is that you will need to restart the process after changing the config, otherwise the changes will not apply.

~~~ yaml
---
baseurl: "http://thomasheller.net/"
languageCode: "EN-en"
title: "thomasheller.net"
MetaDataFormat: "yaml"
---
~~~

## Seperation of content and display

Like almost all static site generators, you can write your content in markdown. Hugo introduces the concept of archetypes to your content, where you can define different layouts based on the type of content they present. Archetypes are identified based on the folder the content files are being stored in. You can define default frontmatter for each archetype, which can be helpful at times.

What I really like that the theme can be defined within the page project as well as a seperate project. Themes define default layouts, partials and shortcodes for the whole site as or for specific archetypes. There are a couple of layouts that will be used to render content from a specific archetype.

For instance you are trying to create a list of all pages and posts on your site. You can iterate over the content with a simple range loop and tell the Render helper which layout to use. The loop will render the summary layout for posts if the pagetype is post and use the default summary layout for any other type of page which hasn't defined a summary layout for its archetype.

~~~ go
{{{{raw}}}}
{{ range .Data.Pages }}
  {{ .Render "summary"}}
{{ end }}
{{{{/raw}}}}
~~~

As already mentioned, themes are not tightly interconnected with the content, so they are really easy to switch out if you want to change the style of your site. Themes define layouts and templates for your archetypes and contents.

## Conclusio

I will probably write up a couple of other things while I go along and learn more about how hugo works. Until now, I am pretty happy with how easy things are to set up and maintain, but I have yet to do a bigger project with it. There is currently only one thing that bugs me a bit: There is currently no real way to have the content of your homepage defined by markdown. Hugo states the opinion that the homepage is likely to be different to other pages when it comes the layout and content, and is defined in the layout/index.html file. As far as I know, this issue is currently being addressed for one of the new releases.
