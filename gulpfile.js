/* eslint-env node */
/* eslint strict:0 */
var gulp = require("gulp");
var insert = require("gulp-file-insert");
var uglify = require("gulp-uglify");
var cssnano = require("gulp-cssnano");
var eslint = require("gulp-eslint");
var autoprefixer = require("gulp-autoprefixer");
var sass = require("gulp-sass");
var size = require("gulp-size");
var runSequnce = require("run-sequence");
var connect = require("gulp-connect");
var karma = require("karma").Server;
var concat = require("gulp-concat");

var p = function (path) {
    return __dirname + (path.charAt(0) === "/" ? "" : "/") + path;
};

gulp.task("css", function() {
    return gulp
      .src(p("src/aNoty.scss"))
      .pipe(sass())
      .pipe(autoprefixer("last 8 version", {cascade: true}))
      .pipe(cssnano())
      .pipe(size({ gzip: true, showFiles: true }))
      .pipe(gulp.dest(p("dist")))
      .pipe(connect.reload());
});

gulp.task("js", function () {
    return gulp
        .src(p("src/aNoty.js"))
        .pipe(insert({"/* style.css */": "dist/aNoty.css"}))
        //.pipe(uglify({ outSourceMap: false }))
        //.pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(p("dist")))
        .pipe(connect.reload());
});

gulp.task("lint", function() {
    return gulp
      .src(p("src/*.js"))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});

gulp.task("karma", function (done) {
    new karma({
        configFile: __dirname + "/karma.conf.js"
    }, done).start();
});

gulp.task("connect", function() {
    connect.server({
        root: "website",
        livereload: true,
        port: 3000
    });
});

gulp.task("test", ["lint", "karma"]);

gulp.task("watch", function () {
    gulp.watch([
        p("src/*.scss"),
        p("src/*.js")
    ], ["build"]);
});

gulp.task("build", function(cb) {
    runSequnce("css", "lint", "js", cb);
});

gulp.task("default", ["connect", "karma", "watch"]);
