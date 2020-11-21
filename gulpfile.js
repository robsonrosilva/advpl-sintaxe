/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const gulp = require('gulp');
const ts = require('gulp-typescript');
const typescript = require('typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const es = require('event-stream');
const vsce = require('vsce');
const nls = require('vscode-nls-dev');

const tsProject = ts.createProject('./tsconfig.json', {
  typescript
});

const inlineMap = true;
const inlineSource = false;
const outDest = 'out';

// If all VS Code langaues are support you can use nls.coreLanguages
const languages = [{
  folderName: 'ptb',
  id: 'pt-br'
},
{
  folderName: 'enu',
  id: 'en'
}
];

gulp.task('default',
  gulp.series(callback)
);

gulp.task('clean', function () {
  return del(['out/**', '*.nls.*.json', 'snippets/*.nls.*.json']);
});

gulp.task('internalCompile', function () {
  return compile(false);
});

gulp.task('internal-nls-compile', function () {
  return compile(true);
});

gulp.task('add-i18n', function () {
  return gulp
    .src(['package.nls.json'], {
      allowEmpty: true
    })
    .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
    .pipe(gulp.dest('.'));
});

gulp.task('add-i18n-snippets', function () {
  return gulp
    .src(['./snippets/advpl.language.nls.json'], {
      allowEmpty: true
    })
    .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
    .pipe(gulp.dest('./snippets'));
});

gulp.task('vsce:publish', function () {
  return vsce.publish();
});

gulp.task('vsce:package', function () {
  return vsce.createVSIX();
});

gulp.task('compile',
  gulp.series('clean', 'internalCompile', callback)
);

gulp.task('build', gulp.series(
  'clean',
  'internal-nls-compile',
  'add-i18n',
  'add-i18n-snippets',
  callback
));

gulp.task('publish',
  gulp.series('build', 'vsce:publish', callback)
);

gulp.task('package',
  gulp.series('build', 'vsce:package', callback)
);

function callback(done) {
  done();
}

function compile(buildNls) {
  var r = tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(buildNls ? nls.rewriteLocalizeCalls() : es.through())
    .pipe(
      buildNls ?
        nls.createAdditionalLanguageFiles(languages, 'i18n', 'out') :
        es.through()
    );

  if (inlineMap && inlineSource) {
    r = r.pipe(sourcemaps.write());
  } else {
    r = r.pipe(
      sourcemaps.write('../out', {
        // no inlined source
        includeContent: inlineSource,
        // Return relative source map root directories per file.
        sourceRoot: '../src'
      })
    );
  }

  return r.pipe(gulp.dest(outDest));
}