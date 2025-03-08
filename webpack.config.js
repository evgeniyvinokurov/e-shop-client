const path = require('path');

module.exports = [
  {
    output: {
        path: path.resolve(__dirname, '.'),
        filename: 'bundle.js',
    },
    entry: './src/index.js',
    mode: 'production',
    module: {
      rules: [
        {          
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader"
          ]
        }
      ],
    }
  }
]