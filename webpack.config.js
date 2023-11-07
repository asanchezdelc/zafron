module.exports = {
  // plugins: [
  //    new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
  //    new webpack.ProvidePlugin({ process: 'process' }),
  //    new webpack.ProvidePlugin({ url: 'url' }),
  // ],
  resolve: {
     fallback: {
        buffer: require.resolve('buffer/'),
        url: require.resolve('url/'),
        process: require.resolve('process/'),
     }
  }
}