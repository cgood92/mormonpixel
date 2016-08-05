'use strict';

//////////////////////////////////////////////////
// IMPORTS
//////////////////////////////////////////////////

var cp = require('child_process'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
    glob = require('glob'),
    es = require('event-stream'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	browserSync = require('browser-sync'),
	del = require('del'),
	gulp = require('gulp'),
	util = require('gulp-util'),
	plumber = require('gulp-plumber'),
	filter = require('gulp-filter'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	sass = require('gulp-sass'),
	mmq = require('gulp-merge-media-queries'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	stylish = require('jshint-stylish'),
	jshint = require('gulp-jshint');

//////////////////////////////////////////////////
// PATHS
//////////////////////////////////////////////////

var distFolder = './dist/files/',
	delPaths = ['./dist/files/**/*.scss'],

	// CLIENT PATHS
	styleEntryPoint = './src/**/*.scss',
	srcStyleFiles = [
		styleEntryPoint
	],
	scriptEntryPoint = './src/**/*.js',
	srcScriptFiles = [
		scriptEntryPoint
	];


//////////////////////////////////////////////////
// ERRORS
//////////////////////////////////////////////////

var onError = function (err) {
	var errorMessage = '';
	util.beep();
	errorMessage += util.colors.red('\n-----------------------------------');
	errorMessage += util.colors.red('\n' + err.message);
	errorMessage += util.colors.red('\n-----------------------------------');
	console.log(errorMessage);
	this.emit('end');
};

var customSassError = function (err) {
	var errorMessage = '';
	util.beep();
	errorMessage += util.colors.red('\n-----------------------------------');
	errorMessage += util.colors.red('\n' + err.file);
	errorMessage += util.colors.red('\n' + err.message);
	errorMessage += util.colors.red('\nline: ' + err.line + ' col: ' + err.column);
	errorMessage += util.colors.red('\n-----------------------------------');
	errorMessage += '\n';
	console.log(errorMessage);
};

//////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////

// MAIN TASKS

gulp.task('default', ['build']);
gulp.task('build', ['copy', 'styles', 'scripts', 'smash']);
gulp.task('lint', ['lintScripts']);
gulp.task('serve', ['build', 'browsersync-setup', 'watch']);

// GENERAL TASKS

gulp.task('browsersync-setup', ['build'], function() {
	var port = process.env.PORT || 4000;
	browserSync({
		proxy: 'http://localhost:' + port,
		open: false,
		port: 3000
	});
});

// watch related tasks, move browserSync.reload calls out of the watch calls and into a gulp task to resolve issue where reload was called after an scss change (which was after another type of change) https://github.com/BrowserSync/browser-sync/issues/717
gulp.task('scripts-watch', ['scripts'], browserSync.reload);

gulp.task('watch', ['build'], function () {
	// CLIENT WATCH
	gulp.watch(srcStyleFiles, ['styles']);
	gulp.watch(srcScriptFiles, ['scripts-watch']);
});

gulp.task('smash', function () {
	del(delPaths).then( function(paths) {
		console.log('Deleting the files', paths);
	});
});

gulp.task('copy', function() {
	return gulp.src(['src/**/*']).pipe(gulp.dest('dist/files'));
});

//Override style task
gulp.task('styles', function() {
	//use the file name to create a directory in dist.
	var cssFilter = filter(['**/*.css']);
	return gulp.src(styleEntryPoint)
		.pipe(plumber({errorHandler: onError}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sass({onError: customSassError}))
		.pipe(rename(function(path) {
			path.dirname = path.basename.indexOf('.') > 0 ? path.basename.substring(0, path.basename.indexOf('.')) : path.basename;
			path.extname = '.css';
		}))
		.pipe(mmq())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distFolder + ''))
		.pipe(cssFilter)
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('lintScripts', function(){
	return gulp.src(srcScriptFiles)
		.pipe(plumber({errorHandler: onError}))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'));
});

// My script task
gulp.task('scripts', ['lintScripts'], function() {
    glob(scriptEntryPoint, function(err, files) {
    	if (err) done(err);

    	var tasks = files.map(function(entry) {
    		return browserify({
    				entries: [entry]
    			})
                .transform(babelify)
    			.bundle()
                .pipe(plumber({errorHandler: onError}))
    			.pipe(source(entry))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
    			.pipe(rename(function (path) {
                   path.dirname = path.basename.indexOf('.') > 0 ? path.basename.substring(0,path.basename.indexOf('.')) : path.basename;
                   path.extname = '.js';
                }))
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(uglify())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(distFolder));
    	});
    	es.merge(tasks);
    });
});

