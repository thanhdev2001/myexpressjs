var db = require('../db')
const shortid = require('shortid')

const process = require('process');
const fs = require('fs')
const path = process.cwd() + '/public/'

const defaultAvatar = 'C:\\Users\\ABC\\ExpressJS/public/images/avatar_user2.jpg'

module.exports.index = function(req, res) {
    res.render('index', {
      users: db.get('users').value()
    })
  }

module.exports.GetUsers = function(req, res){
    res.render('list/users', {
      users: db.get('users').value()
    })
  }

module.exports.search = function(req, res){
    var q = req.query.q;
    var matched = db.get('users').value().filter(function(user){
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })

    res.render('list/search', {
      users: matched
    })
  }

module.exports.create = function(req, res){
    res.render('list/create')
  }

module.exports.getId = function(req, res){
    var id = req.params.id
    var user = db.get('users').find({ id: id}).value()

    res.render('list/view', {
      user: user
    })
  }

module.exports.remove = function(req, res){
    var id = req.params.id  
    var user = db.get('users').find({ id: id}).value()
  
    var imgPath = path + user.avatar

    if(imgPath !== defaultAvatar){
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
    
    db.get('users').remove({ id: id }).write()

    res.render('list/remove', {
      users: db.get('users').value()
    })
  }

module.exports.RefreshRemove = function(req, res){
    res.render('list/remove', {
      users: db.get('users').value()
    })
  }

module.exports.PostCreate = function(req, res){
    req.body.id = shortid.generate()
    
    if(req.file === undefined){
      req.body.avatar = "images/avatar_user2.jpg"
    }
    else{
      req.body.avatar = req.file.path.split('\\').slice(1).join("/")
    }
       
    db.get('users').push(req.body).write()
    res.redirect('/users')
  }

module.exports.PostView = function(req, res){
  var id = req.params.id
  req.body.avatar = req.file.path.split('\\').slice(1).join("/")
  
  db.get('users').find({ id: id}).assign({ avatar: req.body.avatar}).write();
  
  res.redirect('/users')
}