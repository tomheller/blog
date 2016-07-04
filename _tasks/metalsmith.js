'use strict';

const gulp          = require('gulp');
const Metalsmith    = require('metalsmith');
const markdown      = require('metalsmith-markdown');
const drafts        = require('metalsmith-drafts');
const permalink     = require('metalsmith-permalinks');
const collections   = require('metalsmith-collections');
const navigation    = require('metalsmith-navigation');
const assets        = require('metalsmith-assets');
const layouts       = require('metalsmith-layouts');
const inplace       = require('metalsmith-in-place');
const handlebars    = require('handlebars');
const hbsLayout     = require('handlebars-layouts');
const requiredir    = require('require-dir');
const moment        = require('moment');

// register Helpers
handlebars.registerHelper(hbsLayout(handlebars));
const helpers = requiredir('../src/_helpers/');
Object.keys(helpers).forEach(k => handlebars.registerHelper(k, helpers[k]));
const partials = requiredir('../src/_partials/');
Object.keys(partials).forEach(k => handlebars.registerPartial(k, partials[k]));
const layoutPartials = requiredir('../src/_layouts/');
Object.keys(layoutPartials).forEach(k => handlebars.registerPartial(k, layoutPartials[k]));


gulp.task('site', () => {
  Metalsmith('./src')
    .source('.')
    .destination('../dist/')
    .ignore(['_*', '**/_*'])

    .use(drafts())
    .use(collections({
      articles: {
        pattern: 'articles/**.md',
        sortBy: 'date',
        reverse: true
      }
    }))
    // .use(inplace({
    //   engine: 'handlebars',
    // }))
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true
    }))
    .use(permalink({
      linksets: [{
        match: {collection: 'articles' },
        pattern: ':date/:title'
      }]
    }))
    .use(inplace({
      engine: 'handlebars',
    }))
    .use((files, metalsmith, done) => {
      done();
    })
    .use((files, metalsmith, done) => {

      const groupedPages = {};
      for (let article of metalsmith._metadata.articles) {
        const date = moment(article.date);

        // add to year
        groupedPages[date.year()] = groupedPages[date.year()] || {};
        groupedPages[date.year()].data = groupedPages[date.year()].data || [];
        groupedPages[date.year()].data.push(article);

        // add to month
        groupedPages[date.year()][date.month()] = groupedPages[date.year()][date.month()] || {};
        groupedPages[date.year()][date.month()].data = groupedPages[date.year()][date.month()].data || [];
        groupedPages[date.year()][date.month()].data.push(article);

        // add to date
        groupedPages[date.year()][date.month()][date.date()] = groupedPages[date.year()][date.month()][date.date()] || {};
        groupedPages[date.year()][date.month()][date.date()].data = groupedPages[date.year()][date.month()][date.date()].data || [];
        groupedPages[date.year()][date.month()][date.date()].data.push(article);
      }


      // sort them right
      for (let year of Object.keys(groupedPages)) {
        groupedPages[year].data.reverse();

        for (let month of Object.keys(groupedPages[year])) {
          if (month !== 'data') {
            groupedPages[year][month].data.reverse();

            for (let day of Object.keys(groupedPages[year][month])) {
              if (day !== 'data') {
                groupedPages[year][month][day].data.reverse();
              }
            }
          }
        }
      }

      // create files
      const calendarFiles = {};
      for (let year of Object.keys(groupedPages)) {
        calendarFiles[`${year}/index.html`] = {
          layout: 'calendarpage.hbs',
          path: year,
          contents: new Buffer(''),
          title: `${year}`,
          calendararticles: groupedPages[year].data,
        };

        for (let month of Object.keys(groupedPages[year])) {
          if(month !== 'data') {
            var urlmonth = parseInt(month)+1;
            if (urlmonth < 10) {
              urlmonth = '0' + urlmonth;
            }

            calendarFiles[`${year}/${urlmonth}/index.html`] = {
              layout: 'calendarpage.hbs',
              path: `${year}/${urlmonth}`,
              title: `${month}`,
              contents: new Buffer(''),
              calendararticles: groupedPages[year][month].data,
            };
          }

          for (let day of Object.keys(groupedPages[year][month])) {
            if (day !== 'data') {
              calendarFiles[`${year}/${urlmonth}/${day}/index.html`] = {
                layout: 'calendarpage.hbs',
                path: `${year}/${urlmonth}/${day}`,
                title: `${day}`,
                contents: new Buffer(''),
                calendararticles: groupedPages[year][month][day].data,
              };
            }
          }
        }
      }

      files = Object.assign(files, calendarFiles);
      done();
    })
    .use(navigation({
      header: {
        breadcrumbProperty: 'breadcrumb_path',
      }
    }))
    .use(layouts({
      engine: 'handlebars',
      default: 'default.hbs',
      directory: '_layouts/',
      pattern: '**/*.html',     //TODO: not applying layout to articles... why you no?
    }))
    .use(assets({
      source: '../assets',
      destination: './assets/'
    }))

    .build((e) => {
      if(e) {
        throw e;
      }
    });
});

gulp.task('site:watch', () => {
  gulp.watch(['./src/**/*', '!./src/_**/*', './assets/**/*'], ['site']);
});
