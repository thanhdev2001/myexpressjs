var db = require('../db')
const shortid = require('shortid')

module.exports.index = function(req, res) {
  console.log(req.cookies)
    res.render('index', {
      users: db.get('users').value()
    })
  }

module.exports.GetUsers = function(req, res){
    console.log(req.cookies)
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
    
    db.get('users').push(req.body).write()
    res.redirect('/users')
  }