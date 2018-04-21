'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const axios = require('axios')
const express = require('express')
const app = express()
// const apiRoutes = express.Router()
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app){
    //轮播图
      app.get('/api/recommend',(req,res)=> {
        const url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
        axios.get(url,{
          headers:{
            referer:'https://m.y.qq.com/'
          },
          params: req.query
        }).then((response)=>{
          res.json(response.data)
        }).catch((e)=>{
          console.log(e)
        })
      }),
        // app.use('/api',apiRoutes)
        //歌单
      app.get('/api/disclist',(req,res)=> {
        const url='https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url,{
            headers:{
                referer:'https://y.qq.com/'
            },
            params: req.query
        }).then((response)=>{
            res.json(response.data)
        }).catch((e)=>{
            console.log(e)
        })
      }),
      //歌手
      app.get('/api/singer',(req,res)=> {
          const url='https://c.y.qq.com/v8/fcg-bin/v8.fcg'
          axios.get(url,{
              headers:{
                  cookie:'yqq_stat=0',
                  referer:'https://y.qq.com/portal/singer_list.html'
              },
              params: req.query
          }).then((response)=>{
              res.json(response.data)
          }).catch((e)=>{
              console.log(e)
          })
      }),
      //获取歌词
      app.get('/api/lyric',(req,res)=> {
          const url='https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
          axios.get(url,{
              headers:{
                  referer:'https://y.qq.com/portal/player.html'
              },
              params: req.query
          }).then((response)=>{
              let ret=response.data
              if(typeof ret === 'string'){
                let reg = /^\w+\(({[^()]+})\)$/
                let matches = ret.match(reg)
                if(matches){
                  ret = JSON.parse(matches[1])
                }
              }
              res.json(ret)
          }).catch((e)=>{
              console.log(e)
          })
      }),
        //获取歌单歌曲
      app.get('/api/discsonglist',(req,res)=> {
          const url='https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
          let disstid = req.query.disstid
          axios.get(url,{
              headers:{
                  cookie:'yqq_stat=0',
                  referer:`https://y.qq.com/n/yqq/playsquare/${disstid}.html`
              },
              params: req.query

          }).then((response)=>{
              res.json(response.data)
          }).catch((e)=>{
              console.log(e)
          })
      }),
      //获取排行榜数据
      app.get('/api/toplist',(req,res)=> {
          const url='https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
          axios.get(url,{
              headers:{
                  origin:'https://m.y.qq.com',
                  referer:'https://m.y.qq.com/'
              },
              params: req.query

          }).then((response)=>{
              res.json(response.data)
          }).catch((e)=>{
              console.log(e)
          })
      }),
      //获取排行榜歌曲
        app.get('/api/topmusiclist',(req,res)=> {
            const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
            let id = req.query.topid
            axios.get(url,{
                headers:{
                    origin:'https://y.qq.com',
                    referer:`https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=${id}&type=top`
                },
                params: req.query
            }).then((response)=>{
                res.json(response.data)
            }).catch((e)=>{
                console.log(e)
            })
        }),
        //获取搜索字段
      app.get('/api/hotkey',(req,res)=> {
          const url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
          axios.get(url,{
              headers:{
                  origin:'https://m.y.qq.com',
                  referer:'https://m.y.qq.com/'
              },
              params: req.query
          }).then((response)=>{
              res.json(response.data)
          }).catch((e)=>{
              console.log(e)
          })
      }),
        //获取搜索歌曲、歌手
      app.get('/api/search',(req,res)=> {
          const url='https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
          axios.get(url,{
              headers:{
                  origin:'https://m.y.qq.com',
                  referer:'https://m.y.qq.com/'
              },
              params: req.query
          }).then((response)=>{
              res.json(response.data)
          }).catch((e)=>{
              console.log(e)
          })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
