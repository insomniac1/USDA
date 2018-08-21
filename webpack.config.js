var path = require('path');
 var webpack = require('webpack');

 module.exports = {
     entry: './public/js/main.js',
     output: {
         path: path.resolve(__dirname, 'public', 'build'),
         filename: 'main.bundle.js'
     },
     module: {
         rules: [
             {
                 test: /\.e?js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };
