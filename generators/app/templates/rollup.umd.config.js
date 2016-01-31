import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-npm';

export default {
  entry: './src/scripts/<%= moduleSafeName %>.js',
  sourceMap: true,
  format: 'umd',
  moduleName: <%= moduleSafeName %>,
  moduleId: <%= moduleSafeName %>,
  // external: [ imported, files, to, exclude, from, bundle ]
  plugins: [
    babel({
      // exclude: 'node_modules/**'
    }),
    json(),
    commonjs({
      include: 'node_modules/**'
      // exclude: [],
      // extensions: [ '.js', '.cofee' ],
    }),
    npm({
      jsnext: true,
      main: true,
      browser: true, // Prefer browser-ready packages
      skip: [ <% if (includeBliss) { %>'blissfuljs', <% } %><% if (includeLodash) { %>'lodash-es',<% } %>  ]
    }),
  ]
}
