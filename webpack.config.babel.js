import ExtractTextPlugin from 'extract-text-webpack-plugin';
import DotEnvPlugin from 'dotenv-webpack';

const extractCssToFile = new ExtractTextPlugin('stylesheets/style.css');
const dotEnvPlugin = new DotEnvPlugin({
  path: '.env',
});

const webpackConfig = {
  entry: './client/src/main.jsx',
  output: {
    path: `${__dirname}/client/dist/`,
    filename: 'scripts/bundle.js',
    publicPath: 'dist/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules|routes)/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: extractCssToFile.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    extractCssToFile,
    dotEnvPlugin,
  ],
  node: {
    fs: 'empty',
  },
};

export default webpackConfig;
