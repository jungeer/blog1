// 程序入口文件

// 加载 express 模块
const express = require('express')
// 加载 swig 模块
const swig = require('swig')
// 加载 mongoose 模块
const mongoose = require('mongoose')
// 加载 body-parser, 用来处理 post 提交过来的数据
const bodyParser = require('body-parser')
// 加载 cookies 模块
const Cookies = require('cookies')
// 创建 app 应用 => NodeJs Http.createServer()
const app = express()

const User = require('./models/User')

// 设置静态文件托管
app.use('/public', express.static( __dirname + '/public'))

// 第一个参数，模版引擎名称，也是模版文件后缀， 第二个用于处理模版内容的方法
app.engine('html', swig.renderFile)

// 第一个参数必须是 views
app.set('views', './views')

// 第一个参数必须是 view engine, 第二个和 engine 第一个参数一致
app.set('view engine', 'html')

swig.setDefaults({cache: false})

// bodyParser 设置
app.use(bodyParser.urlencoded({extends: true }))
// cookies 设置
app.use( (req, res, next) => {
  req.cookies = new Cookies(req, res)

  // 解析登录用户的 cookies 信息
  req.userInfo = {}
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))

      // 获取当前登录用户是否是管理员
      User.findById(req.userInfo._id).then( (userInfo) => {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })

    } catch (e) {
      next()
    }

  } else {
      next()
  }
})
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

mongoose.connect('mongodb://localhost:27017/blog', (err) => {
  if (err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
    app.listen(8081)
  }
})





// app.get('/', (req, res, next) => {
//   // res.send('<h1>aaaawwwa</h1>')
//   // 解析 views 目录下的指定文件， 解析并返回给客户端
//   // 第一个参数，表示模版的文件，相对于 views 目录 views/index.html
//   // 第二个参数，传递给模版使用的数据
//   res.render('index')
// })
//
// app.get('/main.css', (req, res, next) => {
//   res.setHeader('content-type', 'text/css')
//   res.send('body {background: red}')
// })

// 监听 http 请求
