const webpackConfig = {
  entry: './client/src/js/main.jsx',
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
    ],
  },
};

export default webpackConfig;
