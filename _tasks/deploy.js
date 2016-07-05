const gulp = require('gulp');
const sftp = require('gulp-sftp');
const yargs = require('yargs').argv;

gulp.task('deploy', () => {
  return gulp.src('dist/**')
    .pipe(sftp({
      host: yargs.host,
      user: yargs.user,
      pass: yargs.pass,
      remotePath: yargs.path,
    }));
});
