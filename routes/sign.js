var express = require('express');
var router = express.Router();
var db = require('../db').db
const bcrypt = require('bcrypt')
const salt = 10;

/* GET users listing. */
router.route('/registered')
.get(function(req, res, next) {
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    res.render('registered',{footer:footer,type:type})
  })
})
.post(function(req, res, next) {
  db.get(`select user_id from users where email = ?`,[req.body.email]
        ,function(err,row){
          if(!row){
            bcrypt.hash(req.body.password,salt,function(err,hashpsd){
              db.run(`insert into users(email,password,name,phone,type_id) values(?,?,?,?,?)`
                  ,[req.body.email,hashpsd,req.body.name,req.body.phone,2],
                  function(err){
                    res.redirect('/sign/login')
                  })
            })
          }else{
            var type = req.session.type
            db.get('select * from information',function(err,footer){
              res.render('error',{error: "已有此帳號",footer:footer,type:type})
            })
          }
        })
})

router.route('/login')
.get(function(req,res,next){
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    res.render('login',{footer:footer,type:type})
  })
})
.post(function(req,res,next){
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.get(`select user_id,password,name,type_id from users where email = ?`,[req.body.email],
    function(err,row){
      if(!row){
        res.render('error',{error:'無此帳號',footer:footer,type:type})
      }else{
        bcrypt.compare(req.body.password,row.password,function(err,result){
          if(result){
            req.session.user = row.user_id
            req.session.name = row.name
            req.session.type = row.type_id
            res.redirect('/')
          }else{
            res.render('error',{error:'密碼錯誤',footer:footer,type:type})
          }
        })
      }
    })
  })
})

router.route('/forget')
.get(function(req,res,next){
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    res.render('forget',{footer:footer,type:type})
  })
})
.post(function(req,res,next){
  var email = req.body.email
  var name = req.body.name
  var phone = req.body.phone
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.get(`select name,phone from users where email = ?`
    ,email,function(err,row){
      if(row){
        if(row.name==name && row.phone==phone){
          bcrypt.hash(req.body.password,salt,function(err,hashpsd){
            db.run(`update users set password = ? where email = ?`
            ,[hashpsd,email],function(err){
              req.session.name = req.body.name
              res.redirect('/sign/login')
            })
          })
        }else{
          res.render('error',{error:'驗證失敗',footer:footer,type:type})        
        }
      }else{
        res.render('error',{error:'無此帳號',footer:footer,type:type})
      }
    })
  })
})

router.route('/edit')
.get(function(req,res,next){
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.get(`select * from users where user_id = ?`,req.session.user
    ,function(err,row){
      if(row){
        res.render('edit',{email:row.email,name:row.name,phone:row.phone,footer:footer,type:type})
      }else{
        res.redirect('/')
      }
    })
  })
})
.post(function(req,res,next){
  var email = req.body.email
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.get(`select user_id,email from users where email = ?`,email
    ,function(err,row){
      if(!row || req.session.user==row.user_id){
        db.run(`update users
                set email = ?, name = ?, phone = ?
                where user_id = ?`
                ,[email,req.body.name,req.body.phone,req.session.user]
                ,function(errs){
                  if(errs) console.log(errs)
                  req.session.name = req.body.name
                  res.redirect('/')
                })
      }else{
        res.render('error',{error: "已有此帳號",footer:footer,type:type})
      }
    })
  })
})

router.get('/logout',function(req,res,next){
  req.session.user = null
  req.session.name = null
  req.session.type = null
  res.redirect('/')
})

module.exports = router;
