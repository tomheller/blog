const gulp          = require('gulp');
const Metalsmith    = require('metalsmith');
const markdown      = require('metalsmith-markdown');
const permalink     = require('metalsmith-permalinks');
const collections   = require('metalsmith-collections');

gulp.task('site', () => {
  Metalsmith('./src')
    .source('.')
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

    .destination('../dist/')
    .build((e) => {
      if(e) {
        throw e;
      }
    });
});

gulp.task('site:watch', () => {
  gulp.watch(['./src/**/*', '!./src/_**/*'], ['site']);
});
