const gulp = require('gulp');
const sftp = require('gulp-sftp');

gulp.task('deploy', () => {
  return gulp.src('dist/**')
    .pipe(sftp({
      host: process.env.deploymenthost,
      user: process.env.deploymentuser,
      pass: process.env.deploymentpass,
      remotePath: process.env.deploymentpath,
    }));
});
