const path = require('path');

module.exports = {
  mode: 'production',  // or 'development' for non-minified builds
  entry: './src/depends.js',  // Entry file
  output: {
    filename: 'depends.min.js',  // Output file name
    path: path.resolve(__dirname, 'dist'),  // Output directory
    library: 'Depends',  // The name of the global variable the library will be assigned to
    libraryTarget: 'umd',  // Supports CommonJS, AMD, and browser globals
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Transpile ES6+ code to ES5 for compatibility
        },
      },
    ],
  },
};
