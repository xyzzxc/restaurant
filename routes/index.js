var express = require('express');
var router = express.Router();
var db = require('../db').db
var GetDateTime = require('../db').GetDateTime

/* GET home page. */
router.get('/', function(req, res, next) {
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.all(`select class_id,class from classes`,function(err,classes){
      if(type==1){
        db.all(`select menu_id,name, content, price, class_id, subName, enable from menu order by class_id`,[],function(errs,menu){
          res.render('index',{classes: classes, menu: menu,name:req.session.name,type:type,footer:footer})
          if(errs) console.log(errs)
        })
      }else{
        db.all(`select * from menu where enable = true order by class_id`,[],function(errs,menu){
          res.render('index',{classes: classes, menu: menu,name:req.session.name,type:type,footer:footer})
          if(errs) console.log(errs)
        })
      }
    })
  })
});

router.get('/seats', function(req,res,next){
  db.get('select * from information',function(err,footer){
    db.run(`update seats set user_id = null, time = null
          where time < ?`,[GetDateTime(new Date())],function(err){
          db.all(`select seat_id,time from seats`,function(err,rows){
            res.render(`seats`,{seats: rows,name:req.session.name,type:req.session.type,footer:footer})
          })
    })
  })
})

module.exports = router;
