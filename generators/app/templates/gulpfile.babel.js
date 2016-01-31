import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import rollup from 'rollup-stream';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserSync from 'browser-sync';
import del from 'del';

// rollup configs
import rollupConfUMD from './rollup.umd.config.js';
import rollupConfES6 from './rollup.config.js';


const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('styles/'))
    .pipe(reload({stream: true}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.cssnano())
    .pipe($.rename({extname: '.min.css'}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('styles/'))
    .pipe(reload({stream: true}));
});

function rollupBundle(type, config) {
  return () => {
    return rollup(config)
    .on('error', function(e) {
      console.error(e.stack);
      this.emit('end');
    })
    // point to the entry file.
    .pipe(source('<%= moduleSafeName %>.js', './src/scripts'))
    .pipe($.plumber())
    .pipe(buffer())
    // tell gulp-sourcemaps to load the
    // inline sourcemap produced by rollup-stream.
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.rename({extname: `.${type}.js`}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.if(['*.js', '!*.es2015.js'], $.uglify()))
    .pipe($.if(['*.js', '!*.es2015.js'], $.rename({extname: '.min.js'})))
    .pipe($.if(['*.js', '!*.es2015.js'], $.sourcemaps.write('.')))
    .pipe(gulp.dest('./'));
  }
}

gulp.task('rollupES2015', rollupBundle('es2015', rollupConfES6));
gulp.task('rollupUMD', rollupBundle('umd', rollupConfUMD));

gulp.task('rollupComp', ['rollupES2015', 'rollupUMD']);

gulp.task('scripts', [ 'lint' ],  () => {
  gulp.start('rollupComp');
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}
const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('src/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('images'));
});

gulp.task('extras', ['clean'], () => {
  return gulp.src([
    'src/*.*',
    '!src/*.html',
    '!src/images',
    '!src/scripts'
  ], {
    dot: true
  }).pipe(gulp.dest('./'));
});

gulp.task('clean', del.bind(null, ['*.html', 'images', 'styles/**/*.css']));

gulp.task('serve', ['html', 'styles', 'images'], () => {
  gulp.start('scripts');

  browserSync({
    notify: true,
    port: 9000,
    reloadDelay: 2000,
    server: {
      baseDir: './',
    },
  });

  gulp.watch([
    '*.html',
    '*.js',
    'images/**/*',
  ]).on('change', reload);

  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': './',
      }
    }
  });

  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});
<% if (includeCoveralls) { -%>

gulp.task('coveralls', function () {
  if (!process.env.CI) return;

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe($.coveralls());
});
<% } -%>
gulp.task('build', ['extras', 'html', 'images', 'styles', 'scripts']<% if (includeCoveralls) { -%>, () => {
   gulp.start('coveralls');
}<% } -%>);

gulp.task('default', ['clean'], () => {
  gulp.start('serve');
});
