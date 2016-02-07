'use strict';

var _ = require('lodash');
var extend = _.merge;
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var parseAuthor = require('parse-author');
var githubUsername = require('github-username');
var path = require('path');
var askName = require('inquirer-npm-name');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.option('name', {
      type: String,
      required: false,
      desc: 'Project name'
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      desc: 'Relative path to the project code root'
    });
  },

  initializing: function () {
    this.props = {projectRoot: this.options.projectRoot || './'};
  },

  prompting: {
    askForModuleName: function () {
      this.log(yosay(
        'Welcome to the ' + chalk.red('Haaretz module generator') + '! \n' +
          'Lets start scaffolding your module.'
      ));

      var done = this.async();

      askName({
        name: 'name',
        message: 'Your module Name',
        default: path.basename(process.cwd()),
        filter: _.kebabCase,
        validate: function (str) {
          return str.length > 0;
        }
      }, this, function (name) {
        this.props.name = name;
        done();
      }.bind(this));
    },

    askFor: function () {
      var done = this.async();

      var prompts = [{
        name: 'description',
        message: 'Description',
      }, {
        name: 'homepage',
        message: 'Project homepage url',
      }, {
        name: 'authorName',
        message: 'Author\'s Name',
        default: this.user.git.name(),
      }, {
        name: 'authorEmail',
        message: 'Author\'s Email',
        default: this.user.git.email(),
        store: true,
      }, {
        name: 'authorUrl',
        message: 'Author\'s Homepage',
        store: true,
      }, {
        name: 'keywords',
        message: 'Package keywords (comma separated)',
        filter: function (words) {
          return words.split(/\s*,\s*/g);
        },
      }, {
        name: 'license',
        message: 'Which license do you want to use?',
        default: 'MIT',
      }, {
        type: 'checkbox',
        name: 'deps',
        message: 'Are you planning to use these dependencies in your module?',
        choices: [{
          name: 'bliss',
          value: 'includeBliss',
          checked: false,
        },{
          name: 'lodash-es',
          value: 'includeLodash',
          checked: false,
        }],
      }, {
        name: 'travis',
        type: 'confirm',
        message: 'Include travis config?',
      }, {
        name: 'includeCoveralls',
        type: 'confirm',
        message: 'Send coverage reports to coveralls',
      }];

      this.prompt(prompts, function (props) {
        this.props = extend(this.props, props);
        done();
      }.bind(this));

      this.props.moduleTitle = this.props.name
        .toLowerCase()
        .replace(/(?:^|\s)(\w)/g, function(l) { return l.toUpperCase(); });
      this.props.moduleSafeName = _.camelCase(this.props.name);
      this.props.kebabName = _.kebabCase(this.props.name);
    },

    askForGithubAccount: function () {
      var done = this.async();

      githubUsername(this.props.authorEmail, function (err, username) {
        if (err) username = username || '';

        this.prompt({
          name: 'githubAccount',
          message: 'GitHub username or organization',
          // default: username,
          default: 'haaretz',
        }, function (prompt) {
          this.props.githubAccount = prompt.githubAccount;
          done();
        }.bind(this));
      }.bind(this));
    }
  },

  writing: {
    deps: function () {
      this.props.includeBliss = this.props.deps.indexOf('includeBliss') >= 0;
      this.props.includeLodash = this.props.deps.indexOf('includeLodash') >= 0;
    },

    package: function () {
      var pkg = {
        name: this.props.kebabName,
        version: '0.0.0',
        description: this.props.description,
        license: this.props.license,
        homepage: this.props.homepage,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          url: this.props.authorUrl,
        },
        repository: {
          type: 'git',
          url: 'git+https://github.com/' + this.props.githubAccount + '/' + this.props.kebabName,
        },
        bugs: 'git+https://github.com/' + this.props.githubAccount + '/' + this.props.kebabName + '/issues',
        private: true,
        files: [ this.props.projectRoot ],
        main: this.props.moduleSafeName + '.umd.min.js',
        'jsnext:main': this.props.moduleSafeName + '.es2015.min.js',
        keywords: this.props.keywords,
        devDependencies: {
          'babel-cli': '^6.4.5',
          'babel-core': '^6.4.5',
          'babel-eslint': '^5.0.0-beta6',
          'babel-plugin-transform-object-assign': '^6.3.13',
          'babel-preset-es2015': '^6.3.13',
          'babel-preset-es2015-rollup': '^1.1.1',
          'browser-sync': '^2.11.1',
          'del': '^2.2.0',
          'eslint': '^1.10.3',
          'eslint-config-airbnb': '^4.0.0',
          'eslint-loader': '^1.2.0',
          'gulp': '^3.9.0',
          'gulp-autoprefixer': '^3.1.0',
          'gulp-babel': '^6.1.1',
          'gulp-cache': '^0.4.1',
          'gulp-cssnano': '^2.1.0',
          'gulp-eslint': '^1.1.1',
          'gulp-htmlmin': '^1.3.0',
          'gulp-if': '^2.0.0',
          'gulp-ignore': '^2.0.1',
          'gulp-load-plugins': '^1.2.0',
          'gulp-plumber': '^1.0.1',
          'gulp-rename': '^1.2.2',
          'gulp-sass': '^2.1.1',
          'gulp-size': '^2.0.0',
          'gulp-sourcemaps': '^1.6.0',
          'gulp-uglify': '^1.5.1',
          'gulp-util': '^3.0.7',
          'rollup': '^0.25.1',
          'rollup-plugin-babel': '^2.3.9',
          'rollup-plugin-commonjs': '^2.2.0',
          'rollup-plugin-json': '^2.0.0',
          'rollup-plugin-npm': '^1.3.0',
          'rollup-stream': '^1.4.1',
          'vinyl-buffer': '^1.0.0',
          'vinyl-source-stream': '^1.1.0'
        },
        dependencies: {}
      };

      if (this.props.includeCoveralls) pkg.devDependencies['gulp-coveralls'] = '^0.1.4';
      if (this.props.includeBliss) pkg.dependencies['blissfuljs'] = 'LeaVerou/bliss#gh-pages';
      if (this.props.includeLodash) pkg.dependencies['lodash-es'] = '^4.1.0';

      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    },

    templates: function () {
      mkdirp('src');
      mkdirp('src/scripts');
      mkdirp('src/scripts/lib');
      mkdirp('styles');
      mkdirp('test');

      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('rollup.config.js'),
        this.destinationPath('rollup.config.js'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('rollup.umd.config.js'),
        this.destinationPath('rollup.umd.config.js'),
        this.props
      );

      // Don't overwrite existing READMEs
      if (!this.fs.exists(this.destinationPath('README.md'))) {
        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('README.md'),
          this.props
        );
      }

      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('src/index.html'),
        this.props
      );
      this.fs.copyTpl(
        this.templatePath('index.js'),
        this.destinationPath('src/scripts/' + this.props.moduleSafeName + '.js'),
        this.props
      );
    },

    dotFiles: function () {
      this.fs.copy(
        this.templatePath('babelrc'),
        this.destinationPath('.babelrc')
      );
      this.fs.copy(
        this.templatePath('rollupbabelrc'),
        this.destinationPath('src/.babelrc')
      );
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('eslintrc.js'),
        this.destinationPath('.eslintrc.js')
      );
      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    projectFiles: function () {
      this.fs.copy(
        this.templatePath('CHANGELOG.md'),
        this.destinationPath('CHANGELOG.md')
      );
      this.fs.copy(
        this.templatePath('main.scss'),
        this.destinationPath('styles/main.scss')
      );
    }
  },

  default: function () {
    if (this.props.travis) {
      this.composeWith('travis', { options: { config: {
        install: ['npm install'],
      }}}, {
        local: require.resolve('generator-travis/generators/app')
      });
    }
  },

  install: function () {
    if (!this.options['skip-install']) {
      this.npmInstall();
      // this.installDependencies();
    }
  }
});
