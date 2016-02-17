'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var _ = require('lodash');
var moduleName, moduleSafeName, kebabCaseModuleName, username, distFolder;

describe('generator-htz-module:app', function () {

  before(function () {
    moduleName = 'my module';
    moduleSafeName = _.camelCase(moduleName);
    kebabCaseModuleName = _.kebabCase(moduleName);
    username = 'haaretz';
    distFolder = './';
  });

  describe('with default options', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({skipInstall: true})
        .withPrompts({
          moduleName: moduleName,
          kebabName: moduleSafeName,
          //authorName: "Elia Grady",
          //authorEmail: "eliagrady19@gmail.com",
          //includeSinon: true,
          deps: [],//"includeBliss","includeLodash"
          //includePhantom: true,
          //includeChrome: false,
          //includeFirefox: false,
          browsers: [] //'PhantomJS'
        })
        .withArguments([])
        .on('ready', function (generator) {
          // This is called right before `generator.run()` is called
        })
        .on('end', done);
    });

    it('creates files as expected', function () {
      assert.file([
        '.babelrc',
        '.eslintrc',
        'readme.md',
        '.travis.yml',
        '.editorconfig',
        'src/scripts/' + moduleSafeName + '.js',
        'mocha.config.js',
        'karma.conf.js',
        'test/specs/'+moduleSafeName+'.spec.js'
      ]);
    });

    it('generates correct package.json', function () {
      assert.file('package.json');
      assert.JSONFileContent('package.json', {
        name: kebabCaseModuleName,
        repository: {
          type: 'git',
          url: username + '/' + kebabCaseModuleName
        },
        files: [distFolder],
        main: moduleSafeName + '.umd.min.js'
      });
    });

    it('generates correct readme', function () {
      var moduleNameDef = new RegExp('var ' + moduleSafeName);
      var moduleNameDec = new RegExp('npm install --save ' + kebabCaseModuleName);

      assert.fileContent('readme.md', moduleNameDef);
      assert.fileContent('readme.md', moduleNameDec);
    });

    it('generates correct tests configuration', function () {
      assert.fileContent('karma.conf.js', /test\/\*\*\/\*\.js/);
      assert.fileContent('karma.conf.js', /\'PhantomJS\'/);
      assert.fileContent('karma.conf.js', /\'sinon-chai\'/);
      assert.fileContent('package.json', /\"karma-sinon-chai\"/);
      assert.fileContent('mocha.config.js', /\'sinon\'/);
      assert.noFileContent('karma.conf.js', /\'chai\'/);
      assert.noFileContent('package.json', /\"karma-chai\"/);
    });
  });

  describe('with added libraries', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({skipInstall: true})
        .withPrompts({
          moduleName: moduleName,
          kebabName: moduleSafeName,
          //authorName: "Elia Grady",
          //authorEmail: "eliagrady19@gmail.com",
          //includeSinon: true,
          deps: ["includeBliss","includeLodash"],
          //includePhantom: true,
          //includeChrome: false,
          //includeFirefox: false,
          browsers: [] //'PhantomJS'
        })
        .withArguments([])
        .on('ready', function (generator) {
          // This is called right before `generator.run()` is called
        })
        .on('end', done);
    });

    it('creates files as expected', function () {
      assert.file([
        '.babelrc',
        '.eslintrc',
        'readme.md',
        '.travis.yml',
        '.editorconfig',
        'src/scripts/' + moduleSafeName + '.js',
        'mocha.config.js',
        'karma.conf.js',
        'test/specs/'+moduleSafeName+'.spec.js'
      ]);
    });

    it('generates correct package.json', function () {
      assert.file('package.json');
      assert.JSONFileContent('package.json', {
        name: kebabCaseModuleName,
        repository: {
          type: 'git',
          url: username + '/' + kebabCaseModuleName
        },
        files: [distFolder],
        main: moduleSafeName + '.umd.min.js'
      });
    });

    it('generates correct readme', function () {
      var moduleNameDef = new RegExp('var ' + moduleSafeName);
      var moduleNameDec = new RegExp('npm install --save ' + kebabCaseModuleName);

      assert.fileContent('readme.md', moduleNameDef);
      assert.fileContent('readme.md', moduleNameDec);
    });

    it('generates correct tests configuration', function () {
      assert.fileContent('karma.conf.js', /test\/\*\*\/\*\.js/);
      assert.fileContent('karma.conf.js', /\'PhantomJS\'/);
      assert.fileContent('karma.conf.js', /\'sinon-chai\'/);
      assert.fileContent('package.json', /\"karma-sinon-chai\"/);
      assert.fileContent('mocha.config.js', /\'sinon\'/);
      assert.noFileContent('karma.conf.js', /\'chai\'/);
      assert.noFileContent('package.json', /\"karma-chai\"/);
    });

    it('adds the libraries to the dependencies', function () {
      assert.fileContent('package.json', /\"blissfuljs\"/);
      assert.fileContent('package.json', /\"lodash-es\"/);
      assert.JSONFileContent('package.json',{
        "dependencies": {
          "blissfuljs": "LeaVerou/bliss#gh-pages",
          "lodash-es": /.+/
        }});
    });
  });
});
