var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    browsersync     = require('browser-sync').create(),
    gutil           = require('gulp-util'),
    notify          = require('gulp-notify'),
    sass            = require('gulp-sass'),
    webpack         = require('webpack');


var config = {
    browsersync_proxy: 'pace.localhost.com',
};

var src_paths = {
    styles: 'src/scss/**/*.scss',
    main_scss: 'src/scss/main.scss',
    sprites: 'src/sprites/**/*.png',
    entry_point: 'src/app/index.jsx',
    jsx: 'src/app/**/*.jsx'
};

var dest_paths = {
    stylesheet: './dist/'
};

gulp.task('default', ['watch']);

gulp.task("webpack", function(callback) {
    // run webpack
    webpack({
        entry:  './src/app',
        output: {
            path:     'dist',
            filename: 'app.js',
        },
        module: {
            loaders: [
                {
                  test: /\.jsx?$/,
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: {
                        cacheDirectory: true,
                        presets: ['react', 'es2015']
                    }
                }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('styles', function() {
    return gulp.src(src_paths.main_scss)
        .pipe(sass({
            outputStyle: 'nested'
        }))
        .on('error', notify.onError(function (error) {
            return 'Sass Error: ' + error;
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(dest_paths.stylesheet))
        .pipe(browsersync.reload({stream: true}));
});


gulp.task('build', ['webpack', 'styles'], function(callback) {
    callback();
});


// Watch - run build first, then just update what is needed.
gulp.task('watch', ['build'], function () {
    if (config.browsersync_proxy) {
        browsersync.init({
            proxy: config.browsersync_proxy,
            xip: true,
            reloadDelay: 1000,
            open: "external",
        });
    }

    gulp.watch(src_paths.styles, ['styles']).on('change', browsersync.reload);
    gulp.watch(src_paths.sprites, ['sprites']).on('change', browsersync.reload);
    gulp.watch(src_paths.jsx, ['webpack']).on('change', browsersync.reload);
});
