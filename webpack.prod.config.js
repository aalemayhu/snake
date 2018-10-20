const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const JavaScriptObfuscator = require('webpack-obfuscator')
const HappyPack = require('happypack');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')
const howler = path.join(__dirname, '/node_modules/howler/dist/howler.min.js')
const vendorPackages = /phaser-ce|phaser-arcade-physics|howler|pixi|p2/

module.exports = {
  mode: 'production',
  entry: {
    vendor: ['pixi', 'p2', 'phaser', 'howler'],
    app: [
      path.resolve(__dirname, 'src/app.ts')
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('./dist'),
    publicPath: '/'
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './assets',
        to: './assets'
      }
    ]),
    // new webpack.optimize.CommonsChunkPlugin({
      // name: 'vendor',
      // minChunks: function (module, count) {
        // return module.resource && vendorPackages.test(module.resource) && count >= 1
      // }
    // }),
    new JavaScriptObfuscator({
      rotateUnicodeArray: true
    }, ['vendor.bundle.js']),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body'
    })
  ],
  module: {
    rules: [
      { test: /\.snk?$/, loader: 'raw-loader', exclude: '/node_modules/' },
      {
          test: /\.ts?$/,
          use: [
              'cache-loader',
              {
                loader: 'thread-loader',
                options: {
                    workers: 2
                }
              },
              {
                  loader: 'ts-loader',
                  options: {
                    happyPackMode: true
                  }
              }
          ],
          exclude: '/node_modules/'
      },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-arcade-physics\.js/, use: ['expose-loader?Phaser'] },
      { test: /howler\.min\.js/, use: ['expose-loader?Howler'] },
      { test: /p2\.js$/, use: ['expose-loader?p2'] }
    ]
  },
  resolve: {
    unsafeCache: true,
    extensions: ['.js', '.ts'],
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'howler': howler
    }
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
