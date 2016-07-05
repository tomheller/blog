const gulp = require('gulp');
const sftp = require('gulp-sftp');

console.log(process.env.deploymenthost);
console.log(process.env.deploymentuser);
console.log(process.env.deploymentpass);
console.log(process.env.deploymentpath);

gulp.task('deploy', () => {
  return gulp.src('dist/**')
    .pipe(sftp({
      host: process.env.deploymenthost,
      user: process.env.deploymentuser,
      pass: process.env.deploymentpass,
      remotePath: process.env.deploymentpath,
    }));
});
