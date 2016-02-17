# <%= moduleTitle %> [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]<%
if (includeCoveralls) { %> [![Coverage percentage][coveralls-image]][coveralls-url]<% } -%>

> <%= description %>

## Installation
```sh
$ npm install --save <%= kebabName %> (or: npm i -S <%= kebabName %>)
```

## Usage
```js
var <%= moduleSafeName %> = require('<%= moduleSafeName %>');

// or
import <%= moduleSafeName %> from '<%= moduleSafeName %>';
```

## Running Tests


## License
<%= license %>


[npm-image]: https://badge.fury.io/js/<%= kebabName %>.svg
[npm-url]: https://npmjs.org/package/<%= kebabName %>
[travis-image]: https://travis-ci.org/<%= githubAccount %>/<%= kebabName %>.svg?branch=master
[travis-url]: https://travis-ci.org/<%= githubAccount %>/<%= kebabName %>
[daviddm-image]: https://david-dm.org/<%= githubAccount %>/<%= kebabName %>.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/<%= githubAccount %>/<%= kebabName %>
<% if (includeCoveralls) { -%>
[coveralls-image]: https://coveralls.io/repos/<%= githubAccount %>/<%= kebabName %>/badge.svg
[coveralls-url]: https://coveralls.io/r/<%= githubAccount %>/<%= kebabName %>
<% } -%>
