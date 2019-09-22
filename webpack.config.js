const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/script.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        use: [
          {loader: 'style-loader' /* Adds CSS to the DOM by injecting a `<style>` tag*/},
          {loader: 'css-loader' /* Interprets `@import` and `url()` like `import/require()` and will resolve them */},
          {loader: 'sass-loader' /* Loads a SASS/SCSS file and compiles it to CSS */}
        ]
      },
    ],
  }
};