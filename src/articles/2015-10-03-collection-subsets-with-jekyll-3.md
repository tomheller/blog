---
title: Collection subsets with jekyll 3
date: 2015-10-03 15:38 UTC
tags: jekyll, static site generators
---

As I'm working a lot more with static site generators and fell in love with the hackability of jekyll. Especially with the pre-alpha release of Jekyll 3 and the introduction of hooks into the generation process. This opened up a lot of possibilities.

While testing a couple of scenarios with jekyll I came across a pretty tricky one. Here is the way that [jekyll collections work ](http://jekyllrb.com/docs/collections/) work. You group up a couple of documents, which aren't exactly pages or posts. For example music albums or customer reviews. In the jekyll configuration, you will then define the label and default values for the collection.

~~~ yaml
collections:
  customers:
    output: true
    permalink: :path/
~~~

You can set these collection properties for the whole collection. Additionally the collections allow you to access the data via the liquid template language.

~~~liquid
{% for customer in site.customers %}
  {{customer.name}}
{% endfor %}
~~~

## Scenario
So here is my scenario: I needed to have a lot of customers in the collections dataset to use them in liquid, but only a couple of them did have a customers success story attached to them. The customer stories should generate separate pages.
Since with default jekyll, you are only able to set the output parameter for the whole collection.

## Solution approach
Since I didn't want to split the collections into two in the filesystem, I looked into jekyll 3 hooks to manipulate the collections on generation time. Jekylls code on [github](https://github.com/jekyll/jekyll) is amazingly documented and it didn't take long to hack those hooks together.
Here is what happens in the code:
* Cloning the original collection into a new one
* Dropping all documents in the cloned one
* Fill the new collection with filtered documents

__Little hacks that make this work:__  
If you create a new collection with `Jekyll::Collection.new("label")`, jekyll expects a folder called \_label to be in the source folder. To go around that, I extended the original Jekyll:Collection class and added a function to override the foldername jekyll is looking for.

## Code for jekyll plugin
This is a very crude version of the [jekyll collection subset](https://gist.github.com/Haroldchen/a87cec561ddd0201fa78). A lot of it is still hardcoded but conceptually, it is very possible to extract these things into the jekyll config.



~~~ruby
module Jekyll
  class CustomCollection < Jekyll::Collection

    def setDirectory(dir)
      @directory = site.in_source_dir(dir)
      @relative_directory = dir
    end

  end
end

module Jekyll
  class Document
    def setCollection(collection)
      @collection = collection
    end
  end
end


Jekyll::Hooks.register :site, :after_reset do |site, payload|
  #setup collection
  storyCollection = Jekyll::CustomCollection.new(site, "customerstories")
  storyCollection.metadata['output'] = true
  storyCollection.metadata['permalink'] = "customersStories/how-:name-uses-product/"

  storyCollection.setDirectory("_customers")
  site.collections["customerstories"] = storyCollection
end


Jekyll::Hooks.register :site, :pre_render do |site, payload|

  #get customer collection
  customerCollection = site.collections["customers"];

  #get customer collection payload
  customerCollectionPayload = payload["site"]["collections"].find { |collection|
    collection["label"] == "customers"
  }

  #get story collection payload
  storyCollectionPayload = payload["site"]["collections"].find { |collection|
    collection["label"] == "customerstories"
  }

  #clear storycollection payload because we don't need all of them
  storyCollectionPayload["docs"].clear

  #iterating through the collections and copying over the story documents
  customerCollection.docs.each_index { |i|
    if
      ( customerCollection.docs[i].data["output"].nil? == true &&
        customerCollection.docs[i].data["output"] != false
      ) &&  customerCollection.docs[i].content.strip != ""

      storyCollectionPayload["docs"].push(customerCollectionPayload["docs"][i])
    end
  }

  #fixing the relationship between document and collection
  storyCollectionPayload["docs"].each{ |doc|
    doc.setCollection(site.collections["customerstories"]);
  }
end
~~~
