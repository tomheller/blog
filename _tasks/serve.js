const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './dist/',
    },
    open: false
  });
  gulp.watch("dist/**.*").on('change', browserSync.reload);
});
