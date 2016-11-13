var express = require('express')
var router = express.Router()

var checkNotLogin = require('../middlewares/check').checkNotLogin


// GET /signin 登录页
router.get('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash())
})

// POST /signin 用户登录
router.post('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash())
})

module.exports = router