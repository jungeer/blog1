const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Content = require('../models/Content')
// 统一返回格式
let responseData

router.use( function(req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }

  next()
})

/*
* 用户注册
* 注册逻辑
* 1. 用户名不能为空
* 2. 密码不能为空
* 3. 两次输入密码必须一直
*
* 1.用户是否已经被注册
*    数据库查询
**/
router.post('/user/register', (req, res, next) => {

  let username = req.body.username
  let password = req.body.password
  let repassword = req.body.repassword

  // 用户是否为空
  if( username === '') {
    responseData.code = 1
    responseData.message = '用户名不能为空'
    res.json(responseData)
    return
  }
  // 密码不能为空
  if (password === '') {
    responseData.code = 2
    responseData.message = '密码不能为空'
    res.json(responseData)
    return
  }
  // 两次输入密码必须一致
  if (password !== repassword) {
    responseData.code = 3
    responseData.message = '两次输入的密码不一致'
    res.json(responseData)
    return
  }

  // 用户名是否已经被注册了， 如果数据库已经存在同名数据，表示该用户名已经被注册
  User.findOne({
    username: username
  }).then(function( userInfo ) {
    console.log(userInfo)
    if (userInfo) {
      // 表示有记录
      responseData.code = 4
      responseData.message = '用户名已经被注册了'
      res.json(responseData)
      return
    }
    // 保存用户注册的信息到数据库中
    let user = new User({
      username: username,
      password: password
    })
    return user.save()
  }).then(function(newUserInfo) {
    // console.log(newUserInfo)
    responseData.message = '注册成功'
    res.json(responseData)
  })
})

/*
* 登录
*/

router.post('/user/login', function(req, res) {
  let username = req.body.username
  let password = req.body.password

  if (username === '' || password === '') {
    responseData.code = 1
    responseData.message = '用户名或密码不能为空'
    res.json(responseData)
    return
  }

  // 查询数据库中相同用户名或密码的记录是否存在，如果存在则登录成功
  User.findOne({
    username: username,
    password: password
  }).then((userInfo) => {
    if (!userInfo) {
      responseData.code = 2
      responseData.message = '用户名或密码错误'
      res.json(responseData)
      return
    }
    // 用户名和密码正确的
    responseData.message = '登录成功'
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }))
    res.json(responseData)
    return
  })
})

/*
* 退出
*/
router.get('/user/logout', (req, res) => {
  req.cookies.set('userInfo', null)
  res.json(responseData)
})

// 获取指定文章的所有评论
router.get('/comment', (req, res) => {
  let contentId = req.query.contentid || ''

  Content.findOne({
    _id: contentId
  }).then((content) => {
    responseData.data = content.comments
    res.json(responseData)
  })
})


// 评论提交
router.post('/comment/post', (req, res) => {
  // 内容的 id
  let contentId = req.body.contentid || ''
  let postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  }

  // 查询当前这篇内容的信息
  Content.findOne({
    _id: contentId
  }).then((content) => {
    content.comments.push(postData)
    return content.save()
  }).then((newContent) => {
    responseData.message = '评论成功'
    responseData.data = newContent
    res.json(responseData)
  })
})

module.exports = router
