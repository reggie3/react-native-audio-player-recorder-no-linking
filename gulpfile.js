const gulp = require('gulp');
const concat = require('gulp-concat');
const jeditor = require('gulp-json-editor');
const bump = require('gulp-bump');
const run = require('gulp-run');


// dependencies for npm publishing
const npmDeps = {
    "prop-types": "15.6.1",
    "react-native-blink-view": "0.0.6",
    "react-native-slider": "^0.11.0",
    "react-native-ui-kitten": "^3.0.1",
};

// additional dependencies for expo app
const expoDeps = {
  "expo": "^27.0.0",
  "react": "16.3.1",
  "react-native": "https://github.com/expo/react-native/archive/sdk-27.0.0.tar.gz"
};

// main for npm publishing
const npmMain = 'index.js';
// main for expo app
const expoMain = 'node_modules/expo/AppEntry.js';

// read the package.json and update it for npm publishing
gulp.task('forNPM', (done) => {
  gulp
    .src('./package.json')
    .pipe(bump())
    .pipe(
      jeditor(function(json) {
        json.dependencies = npmDeps;
        json.main = npmMain;
        return json;
      })
    )
    .pipe(concat('package.json'))
    .pipe(gulp.dest('./'));
  done();
});



gulp.task('npm-publish', () => {
  return run('npm publish').exec();
});

gulp.task('npm-publish-beta', () => {
  return run('npm publish --tag beta').exec();
});

gulp.task('git-add', () => {
  return run('git add .').exec();
});

gulp.task('git-commit', () => {
  return run('git commit -m "publishing"').exec();
});

gulp.task('git-push', () => {
  return run('git push origin master').exec();
});

gulp.task('git-push-beta', () => {
  return run('git push origin 5-with-sizable-icons').exec();
});

gulp.task('forExpo', (done) => {
  gulp
    .src('./package.json')
    .pipe(
      jeditor({
        dependencies: expoDeps,
        main: expoMain
      })
    )
    .pipe(concat('package.json'))
    .pipe(gulp.dest('./'));
  done();
});



gulp.task(
  'prod',
  gulp.series(
    'forNPM',
    gulp.parallel(
      gulp.series('git-add', 'git-commit', 'git-push'),
      'npm-publish'
    ),
    'forExpo',
  )
);

gulp.task(
  'beta',
  gulp.series(
    'forNPM',
    gulp.parallel(
      gulp.series('git-add', 'git-commit', 'git-push-beta'),
      'npm-publish-beta'
    ),
    'forExpo',
  )
);

gulp.task(
  'test',
  gulp.series(
    'forNPM',
    gulp.parallel(
      gulp.series('git-add', 'git-commit', 'git-push'),
      'npm-publish'
    ),
    'forExpo',
  )
);
