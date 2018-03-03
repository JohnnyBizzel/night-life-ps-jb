module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015','stage-1']       
                }
      }
      ,{ test: /\.css$/, loader: 'style-loader!css-loader'}
    ] 
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      "node_modules"
    ] 
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    public: 'nightlife-client-ps-jb.glitch.me'
  }
};
