var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)

require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000


var controller = require('./controllers/users.controllers')
var authController = require('./controllers/auth.controller')
var db = require('./db')
const shortid = require('shortid')

var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

var validate = require('./validate/user.validate')

var authMiddleware = require('./middlewares/auth.middleware')

var cookieParser = require('cookie-parser')
app.use(cookieParser(process.env.SESSION_SECRET))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'pug')
app.set('views', './views')

console.log(process.env.SESSION_SECRET)



app.use(express.static('public'))

app.get('/', controller.index)

app.get('/users', authMiddleware.requireAuth, controller.GetUsers)

app.get('/auth/login', authController.login)

app.get('/users/search', controller.search)

app.get('/users/create', authMiddleware.requireAuth, controller.create)

app.get('/users/id/:id', controller.getId)

app.get('/users/remove', authMiddleware.requireAuth, controller.RefreshRemove)

app.get('/users/remove/id/:id', controller.remove)

app.post('/users/create', upload.single('avatar'), validate.PostCreate, controller.PostCreate)

app.post('/users/id/:id', upload.single('avatar'), controller.PostView)

app.post('/auth/login', authController.postLogin)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})