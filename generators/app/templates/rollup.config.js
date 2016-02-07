import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-npm';
import json from 'rollup-plugin-json';

export default {
  entry: './src/scripts/<%= moduleSafeName %>.js',
  sourceMap: true,
  moduleName: '<%= moduleSafeName %>',
  moduleId: '<%= moduleSafeName %>',
  // external: [ imported, files, to, exclude, from, bundle ]
  plugins: [
    json(),
    commonjs({
      include: 'node_modules/**'
      // exclude: [],
      // extensions: ['.js', '.coffee'],
    }),
    npm({
      jsnext: true,
      main: true,
      browser: true, // Prefer browser-ready packages
      skip: [ <% if (includeBliss) { %>'blissfuljs', <% } %><% if (includeLodash) { %>'lodash-es',<% } %>  ]
    }),
  ]
}
