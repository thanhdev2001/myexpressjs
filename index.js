const express = require('express')
const app = express()
const port = 3000

var controller = require('./controllers/users.controllers')
var authController = require('./controllers/auth.controller')
var db = require('./db')
const shortid = require('shortid')

var validate = require('./validate/user.validate')

var authMiddleware = require('./middlewares/auth.middleware')

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))

app.get('/', controller.index)

app.get('/users/cookie', function(req, res, next){
  res.cookie("user-id", 111)
  res.send('Helloo')
})

app.get('/users', authMiddleware.requireAuth, controller.GetUsers)

app.get('/auth/login', authController.login)

app.get('/users/search', controller.search)

app.get('/users/create', authMiddleware.requireAuth, controller.create)

app.get('/users/id/:id', controller.getId)

app.get('/users/remove', authMiddleware.requireAuth, controller.RefreshRemove)

app.get('/users/remove/id/:id', controller.remove)

app.post('/users/create', validate.PostCreate, controller.PostCreate)

app.post('/auth/login', authController.postLogin)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})