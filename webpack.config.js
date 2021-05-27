// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// vue-loader插件
const {VueLoaderPlugin} = require('vue-loader')
// webpack自带自定义压缩
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
// 打包体积可视化分析器
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const path = require('path')
// 提升构建速度:happypack,thread-loader,缓存,预编译 fast-sass-loader tree-shaking DCE
// thead-loader多线程打包
//使用happyPack加快构建速度 多进程模型 底层使用多进程实现多线程执行打包构建任务
const HappyPack = require('happypack')
const os = require('os')
// 根据电脑CPU的数量创建线程池
const happyPackThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})
module.exports = {
  mode: 'development',
  optimization: {
    // 使用webpack的自定义压缩优化 不用UglifyJSPlugin,它只是es5压缩做的很优秀,es6不够好
    minimizer: [
      // 缓存加快构建速度 在一定的时间内不会再去再次压缩了,从缓存读取
      new TerserPlugin({
        cache: true,
        // 打包是比较耗时的事情,压缩时可以开启parallel多线程提高效率
        parallel: true,
        terserOptions: {
          // 压缩的配置项收敛在compress字段中
          compress: {
            // 剔除掉没用的代码
            unused: true,
            // 干掉console和debugger代码
            drop_debugger: true,
            drop_console: true,
            dead_code: true
          }
        }
      })
    ]
  },
  entry: ['@babel/polyfill', path.join(__dirname, 'src', 'index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出的文件路径,绝对路径
    filename: '[name]-[hash]-bundle.js' // 输出的文件名
  },
  devServer: {
    hot: true, // 开启webpack的HMR热替换
    port: 443,
    https: true,
    contentBase: path.resolve(__dirname, 'dist'), // 告诉webpack资源从服务器的哪里加载
    // publicPath: '/dist', // 使用绝对路径
    compress: true //开发服务器是否启动gzip等压缩
  },
  // 配置不用写文件后缀
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    // 配置别名
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  // 文件维度的操作用loader
  // 文件加载器-loader
  module: {
    // 打包构建不解析,干掉耗时的插件
    noParse: /node_modules\/(jquery\.js)/,
    rules: [
      {
        // test: 正则,匹配需要解析的文件格式
        test: /\.css$/,
        // 用什么loader加载 加载顺序是和数组反过来的,数组从后往前加载
        /**
         * xxx-loader:将 Scss/Sass/less 编译成 CSS
         * css-loader:将 CSS 转化成 CommonJS 模块
         * style-loader:将 JS 字符串生成为 style 节点
         */
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js/,
        // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        exclude: path.resolve(__dirname, 'node_modules'),
        // 使用include匹配更精确,可以优化匹配速度
        // include: //
        use: {
          loader: 'babel-loader',
          options: {
            // 是否使用配置文件
            babelrc: false,
            presets: [
              // modules:是否将import,export解析成es5
              [require.resolve('@babel/preset-env', { module: false })]
            ],
            // 是否对编译结果做缓存 默认false
            // cacheDirectory: true
          }
        }
      },
      // 配置vue模板解析规则
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // require不支持图片导入,使用url-loader和file-loader识别图片和字体文件导入时生成路径
      {
        test: /\.(png|svg|gif|jpe?g)$/i,
        loader: 'url-loader',
        options: {
          // 是否开启import/export导入导出支持
          esModule: false
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: 'file-loader',
        options: {
          esModule: false
        }
      }
    ]
  },
  // plugins能对webpack监听一些事件做出一些处理
  plugins: [
    // HMR热替换插件,不用刷新页面就能看到最新修改
    new webpack.HotModuleReplacementPlugin(),
    // 压缩js
    // new UglifyJSPlugin(),
    // 处理生成html
    new HtmlWebpackPlugin({
      title: '动态生成的抬头',
      // 动态生成meta源数据
      // meta: {
      //   // 以对象形式设置页面中的源数据标签
      //   viewport: 'width=device-width'
      // },
      // 要处理的html路径
      template: path.resolve(__dirname, 'public', 'index.html'),
      // 处理后的文件名
      filename: 'index.html'
    }),
    // 每次打包后自动清空之前文件夹打包的产物,只留本次的
    new CleanWebpackPlugin(),
    // vue-loader插件
    new VueLoaderPlugin(),
    // 打包体积分析插件
    // new BundleAnalyzerPlugin(),
    new HappyPack({
      id: 'babel',
      // 配置线程池
      threadPool: happyPackThreadPool,
      // url-loader file-loader这些都不支持,使用前要确定哪些loader是支持happypack的
      loaders: ['babel-loader?cacheDirectory=true']
    }),
    new HappyPack({
      id: 'css',
      // 配置线程池
      threadPool: happyPackThreadPool,
      // url-loader file-loader这些都不支持,使用前要确定哪些loader是支持happypack的
      loaders: ['css-loader']
    })
  ]
}
