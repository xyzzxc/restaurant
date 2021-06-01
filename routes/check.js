var express = require('express');
var router = express.Router();
var db = require('../db').db
var GetDateTime = require('../db').GetDateTime

/* GET users listing. */
router.get('/checkin',function(req,res,next){
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    if(req.session.type==2){
      db.run(`update seats set user_id = null, time = null
          where time < ?`,[GetDateTime(new Date())],function(err){
          db.all(`select seat_id,time,user_id from seats`,function(err,rows){
            var date = new Date()
  
            var min = GetDateTime(date)
            min = min.substring(0,10)
  
            date.setDate(date.getDate()+1)
            var max = GetDateTime(date)
            max = max.substring(0,10)
  
            date.setHours(date.getHours()+1)
            var time = GetDateTime(date).slice(-5)
            res.render(`checkin`,{seats: rows,name:req.session.name,user:req.session.user,min:min,max:max,time:time,footer:footer,type:req.session.type})
          })
      })
    }else{
      res.redirect('/')
    }
  })
})

router.get('/checkin/:datetime/:id',function(req,res,next){
  if(req.session.type==2){
    db.run('update seats set user_id = ?,time = ? where user_id = ?',[null,null,req.session.user],function(err){
      console.log(this.changes)
      db.run('update seats set user_id = ?,time = ? where seat_id = ?'
      ,[req.session.user,req.params.datetime,req.params.id]
      ,function(err){
        res.redirect('/check/checkin')
      })  
    })
  }else{
    res.redirect('/')
  }
})

router.get('/checkout',function(req,res,next){
  if(req.session.type==2){
    db.run('update seats set user_id = ?,time = ? where user_id = ?',[null,null,req.session.user],function(err){
      res.redirect('/check/checkin')
    })
  }else{
    res.redirect('/')
  }
})

module.exports = router;
