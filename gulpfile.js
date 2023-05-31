import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import prefixer from "gulp-autoprefixer";
import minify from "gulp-clean-css";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import imagemin from "gulp-imagemin";
import browserSync from "browser-sync";
import pug from "gulp-pug";
// import imagewebp from "gulp-webp;";
import clean from "gulp-clean";

const sass = gulpSass(dartSass);

const cleanDist = () => {
   return gulp.src("dist").pipe(clean());
};

export const compileScss = () => {
   return gulp
      .src(["app/css/**/*.scss", "node_modules/swiper/swiper.scss"])
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(concat("styles.min.css"))
      .pipe(prefixer({ cascade: false }))
      .pipe(minify())
      .pipe(gulp.dest("app/css"))
      .pipe(browserSync.stream());
};

export const packScripts = () => {
   return gulp
      .src(["node_modules/swiper/swiper-bundle.min.js", "app/js/main.js"])
      .pipe(concat("main.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("app/js"))
      .pipe(browserSync.stream());
};

export const packImages = () => {
   return gulp.src("app/images/**/*").pipe(imagemin()).pipe(gulp.dest("dist/images"));
};

// const webpImages = () => {
//    return src("dist/images/minified-images/*.{jpg, png}").pipe(imagewebp()).pipe("dist/img");
// };

export const compressHtml = () => {
   return gulp
      .src("app/*.pug")
      .pipe(pug({ pretty: true }))
      .pipe(gulp.dest("app/"))
      .pipe(browserSync.stream());
};

export const watching = () => {
   gulp.watch(["app/css/*.scss"], compileScss);
   gulp.watch(["app/*.pug"], compressHtml);
   gulp.watch(["app/js/**/*.js", "!app/js/main.min.js"], packScripts);
};

export const browsersync = () => {
   browserSync.init({
      server: {
         baseDir: "app/",
      },
   });
};

export const build = gulp.series(cleanDist, packImages, () => {
   return gulp
      .src(["app/css/styles.min.css", "app/fonts/**/*", "app/js/main.min.js", "app/*.html"], {
         base: "app",
         allowEmpty: true,
      })
      .pipe(gulp.dest("dist"));
});

export default gulp.parallel(compileScss, packScripts, compressHtml, browsersync, watching);
