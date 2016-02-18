import rollupConf from './rollup.config';
module.exports = function (config) {
  config.set({
    files: [
      // Each file acts as entry point for the rollup configuration
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'test/**/*.js'
    ],
    frameworks: ['mocha', 'sinon-chai'],
    preprocessors: {
      'test/**/*.js': ['rollup']
    },
    browsers: ['PhantomJS'],
    plugins: [
      require('karma-mocha'),
      require('karma-sinon-chai'),
      require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-spec-reporter')
    ]
  });
};
