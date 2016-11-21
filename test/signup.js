var path = require('path')
var assert = require('assert')
var request = require('supertest')
var app = require('../index')
var User = require('../lib/mongo').User

describe('signup', () => {
  describe('POST /signup', () => {
    var agent = request.agent(app)
    beforeEach(done => {
      User
        .create({
          name: 'aaa',
          password: '123456',
          avatar: '',
          gender: 'x',
          bio: '', 
        })
        .exec()
        .then(() => {
          done()
        })
        .catch(done)
    })

    afterEach(done => {
      User
        .remove({})
        .exec()
        .then(() => {
          done()
        })
        .catch(done)
    })

    it('wrong name', done => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: ''})
        .redirects()
        .end((err, res) => {
          if (err) return done(err)
          assert(res.text.match(/名字请限制在1-10个字符/))
          done()
        })
    })

    it('wrong gender', done => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: 'nswbmw', gender: 'a'})
        .redirects()
        .end((err, res) => {
          if (err) return done(err)
          assert(res.text.match(/性别只能是m、f 或 x/))
          done()
        })
    })

    it('duplicate name', done => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: 'aaa', gender: 'm', bio: 'noder', password: '123456', repassword: '123456'})
        .redirects()
        .end((err, res) => {
          if (err) return done(err)
          assert(res.text.match(/用户名已被占用/))
          done()
        })
    })

    it('success', done => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({name: 'nswbmw', gender: 'm', bio: 'noder', password:'123456', repassword:'123456'})
        .redirects()
        .end((err, res) => {
          if (err) return done(err)
          assert(res.text.match(/注册成功/))
          done()
        })
    })
  })
})