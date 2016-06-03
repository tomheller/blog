const gulp          = require('gulp');
const Metalsmith    = require('metalsmith');
const markdown      = require('metalsmith-markdown');
const drafts        = require('metalsmith-drafts');
const permalink     = require('metalsmith-permalinks');
const collections   = require('metalsmith-collections');
const assets        = require('metalsmith-assets');
const layouts       = require('metalsmith-layouts');
const inplace       = require('metalsmith-in-place');
const handlebars    = require('handlebars');
const hbsLayout     = require('handlebars-layouts');
const requiredir    = require('require-dir');

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
    .use(inplace({
      engine: 'handlebars',
    }))
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
    .use((files, metalsmith, done) => {
      console.log(metalsmith);
      done();
    })
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
