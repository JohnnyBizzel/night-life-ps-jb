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
      // ,
      // {
      //   test: /\.scss$/,  // regex to select only .css files
      //   use: [
      //     {
      //     loader: "style-loader"
      //     },
      //     {
      //     loader: "css-loader",
      //     options: {
      //       modules: true
      //     }
      //     },
      //     {
      //       loader:"sass-loader"
      //     }
      //   ] // loader: 'style-loader!css-loader!sass-loader'			
      // }
    ] // the sass-loader converts the sass into css, the css-loader puts that css into the JS, the style-loader puts the javascript into the DOM.
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
