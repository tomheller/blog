---
title: Static site generators for non-blog sites
date: 2015-10-01
tags: jekyll, static site generators, hacking
---

I really fell in love with static site generators in the last couple of months. Thinking about the websites I usually create, there isn't a lot of dynamic content in there. This is why I started to experiment with static site generators like jekyll and middleman. They are well crafted tools for creating a simple blog or blog like sites (i.e. documentation sites), but as you start getting towards more layout heavy pages you start to struggle with the limited layout capabilities brought by markdown.

## The path taken
For about a year now, I am building a, what turned out to be, a rather complex site. Starting out it was supposed to be a couple of pages, showing the features and key values of a product. And as it is tends to happen with long running projects, they start to get messy over time, or as we like to put it _grown historically_.

### It's not a lot, I can maintain that content
At first, as the developer I was responsible for getting content into the site. Content creators forwarded various versions of google docs, word files or even just text snippets in emails and it was my job to get them into valid markup so they would look good on the pages. In the early stages of the project this was kind of the right approach for us. Layouts, styles and content strategy regularly changed and migrating things wasn't always easy. At first there really weren't a lot of pages to maintain so changing things quickly felt like prototyping.
With time passing and things slowly settling, there were a lot more content changes coming in. For a developer like me, this was the less exciting time. Copying content pieces in the correct markup without having to think up new designs or ways to make things look good.  

### How to make content maintenance practicable
After about 2 months without major layout or style changes, the content copying got a little bit tedious. The process of writing up content in a word document and later transferring it into markup was far from perfect. Additionally, we didn't reuse a lot of code in the first stages, which basically resulted in a lot of hardcoded html pages with a bit of layout and generation help from jekyll.
My first approach was to build a lot of layout components and snippets, which could then be reused by a jekyll generator. The goal was to make creating the pages simple enough to enable the content creators to do it themselves. I wrote up a jekyll generator, which took JSON files and transformed them into html pages. These JSON files defined all the frontmatter, all content sections and their layouts. What seemed as a rather simple setup at first quickly resulted in a rather complicated JSON structure with a lot of liquid magic in the jekyll layout files.
This was better to use than writing straight up html, but the ease of use was far from acceptable.

### Accepting failure and retrying
Even with the JSON generator, creating new pages still was not easy enough for a person, not familiar with the code. The process hasn't changed except that I kept copying the content into JSON files instead of html ones. The layout components and snippets helped to make layout and styles maintenance a lot easier across the whole site.
Keeping to the strengths of jekyll, the new trial-solution is now based on markdown content. With jekylls ability to enhance markdown with the highly hackable liquid templating language, I should be able to introduce a little bit of layout management into markdown.


As this blog post goes out, I haven't finished this approach yet. But I am very confident, that this will work.
With all the templating logic moving from liquid to ruby there is a lot more possible. I will write up another post with more details on how to get layout controls into markdown if they are needed.
