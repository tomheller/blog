const gulp          = require('gulp');
const Metalsmith    = require('metalsmith');
const markdown      = require('metalsmith-markdown');
const permalink     = require('metalsmith-permalinks');
const collections   = require('metalsmith-collections');
const assets        = require('metalsmith-assets');


gulp.task('site', () => {
  Metalsmith('./src')
    .source('.')
    .destination('../dist/')
    .ignore(['_*', '**/_*'])

    .use(collections({
      articles: {
        pattern: '*/**.md',
        sortBy: 'date',
        reverse: true
      }
    }))
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true
    }))
    .use((files, metalsmith, done) => {
      console.log(files);
      done();
    })
    .use(permalink({
      linksets: [{
        match: {collection: 'articles' },
        pattern: ':date/:title'
      }]
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
