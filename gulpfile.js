var GULP       = require("gulp"),
    CLEAN      = require("gulp-clean"),
    CONCAT     = require("gulp-concat"),
    NODEMON    = require("gulp-nodemon"),
    PUMP       = require('pump'),
    RENAME     = require('gulp-rename'),
    UGLIFY     = require('gulp-uglify'),
    ZIP        = require('gulp-zip');

// server related
GULP.task("serve", [], function () {
    return NODEMON({
        script: "server/index.js",
        ext: "js html",
        env: { "NODE_ENV": "development" }
    });
});

GULP.task("default", ['serve'], function () {});

// build related
GULP.task("clean_build", [], function (cb) {
    PUMP(
        [
            GULP.src('build', {read: false}),
            CLEAN()
        ],
        cb
    );
});

GULP.task("uglify_src", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src('src/**/*.js'),
            CONCAT('bundle.js'),
            UGLIFY(),
            GULP.dest('build/')
        ],
        cb
    );
});

GULP.task("uglify_vendor", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src('vendor/**/*.js'),
            CONCAT('vendor.js'),
            UGLIFY(),
            GULP.dest('build/')
        ],
        cb
    );
});

GULP.task("copy_css_assets", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src(['assets/css/**/*.css']),
            GULP.dest('build/assets/css')
        ],
        cb
    );
});

GULP.task("copy_font_assets", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src(['assets/fonts/**/*.ttf']),
            GULP.dest('build/assets/fonts')
        ],
        cb
    );
});

GULP.task("copy_image_assets", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src(['assets/images/**/*.png']),
            GULP.dest('build/assets/images')
        ],
        cb
    );
});

GULP.task("copy_json_assets", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src(['assets/json/**/*.json']),
            GULP.dest('build/assets/json')
        ],
        cb
    );
});

GULP.task("copy_music_assets", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src(['assets/music/**/*.wav', 'assets/music/**/*.mp3']),
            GULP.dest('build/assets/music')
        ],
        cb
    );
});

GULP.task("copy_sound_assets", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src(['assets/sounds/**/*.wav', 'assets/sounds/**/*.mp3']),
            GULP.dest('build/assets/sounds')
        ],
        cb
    );
});

GULP.task("copy_assets", [
    "copy_css_assets",
    "copy_font_assets",
    "copy_image_assets",
    "copy_json_assets",
    "copy_music_assets",
    "copy_sound_assets"
], function () {});

GULP.task("copy_index", ["clean_build"], function (cb) {
    PUMP(
        [
            GULP.src(['index.dist.html']),
            RENAME('index.html'),
            GULP.dest('build/')
        ],
        cb
    );
});

GULP.task("build", [
    "uglify_src",
    "uglify_vendor",
    "copy_assets",
    "copy_index"
], function () {});

// dist related
GULP.task("clean_dist", [], function (cb) {
    PUMP(
        [
            GULP.src('dist', {read: false}),
            CLEAN()
        ],
        cb
    );
});

GULP.task("copy_itch_manifest", ["build"], function (cb) {
    PUMP(
        [
            GULP.src('.itch.toml'),
            GULP.dest('build/')
        ],
        cb
    );
});

GULP.task("dist", ["clean_dist", "copy_itch_manifest"], function (cb) {
    PUMP(
        [
            GULP.src('build/**/*'),
            ZIP('game.zip', {"compress": true}),
            GULP.dest('dist')
        ],
        cb
    );
});

// clean all task
GULP.task("clean", [
    "clean_build",
    "clean_dist"
], function () {});
