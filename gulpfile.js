var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var path = require("path");
var del = require('del');
var useref = require('gulp-useref');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');
var package = require('./package.json')
var iife = require("gulp-iife");
var uglifyes = require('uglify-es');
var composer = require('gulp-uglify/composer');
var minifyes = composer(uglifyes, console);
var fs = require('fs');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var bulkSass = require('gulp-sass-bulk-import');


var destination = 'dist/';


gulp.task('clean', function () {
    return del('./' + destination + '**');
});

gulp.task('copy-files', function () {
    return gulp.src([
        'index.php', 'robots.txt', '.htaccess', 'assets/font/**', 'assets/img/**','assets/img/**', 'app/**', 'app/.htaccess',
        'assets/admin/css/img/**',
        '!app/config.ini',
        '!app/composer.json',
        '!app/composer.lock'

    ], {base: ".", nodir: true})
        .pipe(gulp.dest(destination));
});


// Static server
gulp.task('browser-sync', function () {

    historyApiFallback = require('connect-history-api-fallback');
    browserSync.init({
        open: 'external',
        host: 'shahresofal.ooo',
        //proxy: "shahresofal.ooo",
        ui: false,
        middleware: [historyApiFallback()]
    });
});

gulp.task('angular', function (done) {
    var sources = ['assets/app/app.js', 'assets/app/**/*.js'];

    return gulp.src(sources, {base: '.'})
        .pipe(sourcemaps.init())
        .pipe(concat('assets/js/app.js'))
        .on('error', logError)
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/'}))
        .pipe(gulp.dest(destination));
});

gulp.task('dependencies', function (done) {
    gulp.src(['app/view/fragments/base.php'], {base: '.'})
        .pipe(useref({searchPath: '.'}))
        .pipe(gulp.dest(destination));
    setTimeout(function () {
        done();
    },1000)
});

gulp.task('angular-admin', function (done) {
    var sources = ['assets/admin/app/app.js', 'assets/admin/app/**/*.js'];

    return gulp.src(sources, {base: '.'})
        .pipe(sourcemaps.init())
        .pipe(concat('assets/admin/js/app.js'))
        .on('error', logError)
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/'}))
        .pipe(gulp.dest(destination));

});

gulp.task('dependencies-admin', function (done) {

    gulp.src(['app/view/admin/admin-index.php'], {base: '.'})
        .pipe(useref({searchPath: '.'}))
        .pipe(gulp.dest(destination));

    setTimeout(function () {
        done();
    },1000)

});


gulp.task('scss', function () {
    return gulp.src('assets/css/style.scss')
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({importer: importer}))
        .on('error', logError)
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/assets/css'}))
        .pipe(gulp.dest(destination + 'assets/css/'))
        .pipe(browserSync.stream());
});


gulp.task('scss-admin', function () {
    return gulp.src('assets/admin/css/style.scss')
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass({importer: importer}))
        .on('error', logError)
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/assets/admin/css'}))
        .pipe(gulp.dest(destination + 'assets/admin/css/'))
        .pipe(browserSync.stream());
});


var svgSprite = require("gulp-svg-sprite");

gulp.task('sprites', function () {
    var svgConfig = {
        shape: {
            dimension: {			// Set maximum dimensions
                maxWidth: 24,
                maxHeight: 24
            },
            spacing: {			// Add padding
                padding: 0,
                box: 'icon'
            }
        },
        mode: {
            symbol: {			// Activate the «view» mode
                common: 'svg',
                bust: false,
                dest: 'assets/css',
                dimensions: false,
                prefix: '.svg-%s',
                sprite: 'sprite.svg',
                //example: true,
                render: {
                    css: false
                }
            }
        },
        svg: {							// General options for created SVG files
            xmlDeclaration: false,						// Add XML declaration to SVG sprite
            doctypeDeclaration: true,						// Add DOCTYPE declaration to SVG sprite
            namespaceIDs: true,						// Add namespace token to all IDs in SVG shapes
            namespaceClassnames: true,						// Add namespace token to all CSS class names in SVG shapes
            dimensionAttributes: false						// Width and height attributes on the sprite
        }

    };

    return gulp.src("assets/svg/**/*.svg").pipe(svgSprite(svgConfig)).pipe(gulp.dest(destination));
});
gulp.task('sprites-admin', function () {
    var svgConfig = {
        shape: {
            dimension: {			// Set maximum dimensions
                maxWidth: 24,
                maxHeight: 24
            },
            spacing: {			// Add padding
                padding: 0,
                box: 'icon'
            }
        },
        mode: {
            symbol: {			// Activate the «view» mode
                common: 'svg',
                bust: false,
                dest: 'assets/admin/css',
                dimensions: false,
                prefix: '.svg-%s',
                sprite: 'sprite.svg',
                //example: true,
                render: {
                    css: false
                }
            }
        },
        svg: {							// General options for created SVG files
            xmlDeclaration: false,						// Add XML declaration to SVG sprite
            doctypeDeclaration: true,						// Add DOCTYPE declaration to SVG sprite
            namespaceIDs: true,						// Add namespace token to all IDs in SVG shapes
            namespaceClassnames: true,						// Add namespace token to all CSS class names in SVG shapes
            dimensionAttributes: false						// Width and height attributes on the sprite
        }

    };

    return gulp.src("assets/admin/svg/**/*.svg").pipe(svgSprite(svgConfig)).pipe(gulp.dest(destination));
});

gulp.task('js-watch', gulp.series(gulp.parallel('angular'), function (done) {
    browserSync.reload();
    done();
}));
gulp.task('js-watch-admin', gulp.series(gulp.parallel('angular-admin'), function (done) {
    browserSync.reload();
    done();
}));
gulp.task('svg-watch', gulp.series(gulp.parallel('sprites'), function (done) {
    browserSync.reload();
    done();
}));
gulp.task('svg-watch-admin', gulp.series(gulp.parallel('sprites-admin'), function (done) {
    browserSync.reload();
    done();
}));

gulp.task('watch', gulp.series(gulp.parallel('scss', 'angular', 'scss-admin', 'angular-admin', 'sprites', 'sprites-admin'), function watch (done) {
    gulp.watch(['assets/**/*css'], gulp.parallel('scss'));
    gulp.watch(['assets/svg/**/*.svg'], gulp.parallel('svg-watch'));
    gulp.watch(['assets/app/**/*.js'], gulp.parallel('js-watch'));
    gulp.watch(["assets/app/**/*.html", "app/**/*.php", "assets/admin/app/**/*.html"]).on('change', browserSync.reload);

    gulp.watch(['assets/admin/**/*css'], gulp.parallel('scss-admin'));
    gulp.watch(['assets/admin/app/**/*.js'], gulp.parallel('js-watch-admin'));
    gulp.watch(['assets/admin/svg/**/*.svg'], gulp.parallel('svg-watch-admin'));
    done();
}));


gulp.task('default', gulp.series(gulp.parallel('clean'), 'watch', 'browser-sync'));

function importer(url, prev, done) {
    if (url[0] === '~') {
        url = path.resolve('./node_modules', url.substr(1));
    } else if (url[0] === '/') {
        //url = path.resolve( url.substr(1));
    }
    return {file: url};
}

function logError(error) {

    // If you want details of the error in the console
    console.log(error.toString());
    this.emit('end')
}

gulp.task('ng-templates', function () {
    return gulp.src(['assets/app/**/*.html'])
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true, sortAttributes: true, sortClassName: true, ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?(\?>|$)/], trimCustomFragments: true}))
        .pipe(templateCache({module: 'app', root: '/assets/app/'}))
        .pipe(gulp.dest(destination + 'assets/js'));
});

gulp.task('ng-templates-admin', function () {
    return gulp.src(['assets/admin/app/**/*.html'])
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true, sortAttributes: true, sortClassName: true, ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?(\?>|$)/], trimCustomFragments: true}))
        .pipe(templateCache({module: 'app-admin', root: '/assets/admin/app/'}))
        .pipe(gulp.dest(destination + '/assets/admin/js'));
});


gulp.task('concat-ng-templates', function () {
    return gulp.src(['assets/js/app.js', 'assets/js/templates.js'], {base: destination, cwd: destination})
        .pipe(concat('assets/js/app.js'))
        .pipe(gulp.dest(destination));
});


gulp.task('concat-ng-templates-admin', function () {
    return gulp.src(['assets/admin/js/app.js', 'assets/admin/js/templates.js'], {base: destination, cwd: destination})
        .pipe(concat('assets/admin/js/app.js'))
        .pipe(gulp.dest(destination));
});

gulp.task('scripts-minify', gulp.series('angular', 'ng-templates', 'dependencies', 'concat-ng-templates', function minify(done) {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    del('./' + destination + 'assets/js/templates.js');
    return gulp.src(['assets/js/app.js'], {base: destination, cwd: destination})
        .pipe(iife({
            useStrict: false
        }))
        .pipe(minifyes().on('error', function (e) {
            console.log(e);
            //callback(e);
        }))
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(destination));
}));

gulp.task('scripts-minify-admin', gulp.series('angular-admin', 'ng-templates-admin', 'dependencies-admin', 'concat-ng-templates-admin', function scriptsMinifyAdmin(done) {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    del('./' + destination + 'assets/admin/js/templates.js');
    return gulp.src(['assets/admin/js/app.js'], {base: destination, cwd: destination})
        .pipe(iife({
            useStrict: false
        }))
        .pipe(minifyes())/*.on('error', function (e) {
            console.log(e);
            //callback(e);
        }))*/
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(destination));
}));


gulp.task('styles-minify', gulp.series(gulp.parallel('scss', 'sprites'), function () {
    del('./' + destination + 'assets/css/style.scss');
    return gulp.src(['assets/css/style.css'], {base: destination, cwd: destination})
    //.pipe(sourcemaps.init())
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 'none',
                    normalizeUrls: false
                }
            },
            rebase: false
        }))
        //.pipe(sourcemaps.write())
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(destination));
}));

gulp.task('styles-minify-admin', gulp.series(gulp.parallel('scss-admin', 'sprites-admin'), function () {
    del('./' + destination + 'assets/admin/css/style.scss');
    return gulp.src(['assets/admin/css/style.css'], {base: destination, cwd: destination})
    //.pipe(sourcemaps.init())
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 'none',
                    normalizeUrls: false
                }
            },
            rebase: false
        }))
        //.pipe(sourcemaps.write())
        .pipe(header(fs.readFileSync('header.txt', 'utf8'), {pkg: package}))
        .pipe(gulp.dest(destination));
}));

gulp.task('php-minify', function () {
    return gulp.src(['app/view/fragments/base.php'], {base: destination, cwd: destination})
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true, sortAttributes: true, sortClassName: true, ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?(\?>|$)/], trimCustomFragments: true}))
        .pipe(gulp.dest(destination));
});

gulp.task('php-minify-admin', function () {
    return gulp.src(['app/view/fragments/base.php'], {base: destination, cwd: destination})
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true, sortAttributes: true, sortClassName: true, ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?(\?>|$)/], trimCustomFragments: true}))
        .pipe(gulp.dest(destination));
});


gulp.task('production-replace', function (done) {
    function rndStr() {
        var x = '';
        while (x.length != 5) {
            x = Math.random().toString(36).substring(7).substr(0, 5);
        }
        return x;
    }

    var cacheBuster = rndStr();

    return gulp.src(['app/view/fragments/base.php', 'app/view/admin/admin-index.php', 'assets/js/app.js', 'assets/admin/js/app.js'], {base: destination, cwd: destination})
    //adding version to stop caching
        .pipe(replace('js/app.js', 'js/app.js?cs=' + cacheBuster))
        .pipe(replace('css/style.css', 'css/style.css?cs=' + cacheBuster))
        .pipe(replace("sprite.svg", 'sprite.svg?cs=' + cacheBuster))

        .pipe(replace('/dist/', '/'))
        .pipe(replace('debugInfoEnabled(!0)', 'debugInfoEnabled(false)'))
        .pipe(replace('[[version]]', package.version))

        .pipe(gulp.dest(destination));

});

gulp.task('distribute', gulp.series('clean', 'copy-files',
    gulp.parallel('styles-minify', 'styles-minify-admin', 'scripts-minify', 'scripts-minify-admin'),
    gulp.parallel('php-minify', 'php-minify-admin'),
    'production-replace'
    )
);


gulp.task('deploy', function () {

    var ftp = require('vinyl-ftp');
    var conn = ftp.create({
        host: 'summer.talahost.com',
        user: 'gitlab@shahresofal.com',
        password: gutil.env.pass,
        parallel: 7,
        log: gutil.log
    });

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src(['./dist/**', 'dist/**/.htaccess'], {base: './dist', buffer: false}).pipe(conn.newer('/')) // only upload newer files
        .pipe(conn.dest('/'));

});