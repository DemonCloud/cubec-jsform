const rollup = require('rollup');

const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');
const optimizeJs = require('rollup-plugin-optimize-js');
const autoExternal = require('rollup-plugin-auto-external');

const path = require('path');
const inputfile = path.resolve('./') + '/src/jsform/index.js';
const outputfile = path.resolve('./') + '/dist/jsform.js';

// 定义plugin
const plugins = [
  resolve(),

  autoExternal({
    builtins: false,
    dependencies: true,
    packagePath: path.resolve(__dirname, "./package.json"),
    peerDependencies: false,
  }),

  commonjs({
    include: 'node_modules/**',
    // namedExports: {
    //   'node_modules/_@ali_app-detector@0.3.0@@ali/app-detector/index.js': [ 'isWeex','isWeb' ]
    // }
  }),

  babel({
    exclude: ['node_modules/**'], // only transpile our source code,
    runtimeHelpers: true,
    externalHelpers: true,
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
    ],
    plugins: [
      '@babel/external-helpers',
      [
        '@babel/transform-runtime',
        {
          regenerator: false
        },
      ],
    ],
  }),

  // 压缩
  // uglify.uglify(),

  optimizeJs()
];

const builder = async function() {
  const bundle = await rollup.rollup({
    input: inputfile,
    plugins,
  });

  await bundle.write({
    file: outputfile,
    sourcemap: false,
    format: 'umd',
    // external: 'cubec',
    name: 'JsForm',
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning); // this requires Rollup 0.46
    }
  });

  return bundle;
};

builder();
