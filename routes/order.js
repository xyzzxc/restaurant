var express = require('express');
var router = express.Router();
var db = require('../db').db
var GetDateTime = require('../db').GetDateTime

/* GET users listing. */
router.get('/ordering',function(req,res,next){
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    if(req.session.type==2){
      db.all(`select m.name name, c.quantity q, m.price*c.quantity cost, c.menu_id menu_id
      from menu m,cart c where c.user_id = ? and c.menu_id = m.menu_id`
      ,req.session.user,function(err,cart){
        db.all('select * from classes',function(err,classes){
          db.all(`select * from menu where enable = true order by class_id`,function(errs,menu){
            var date = new Date()
  
            var min = GetDateTime(date)
            min = min.substring(0,10)
  
            date.setDate(date.getDate()+1)
            var max = GetDateTime(date)
            max = max.substring(0,10)
  
            date.setHours(date.getHours()+1)
            var time = GetDateTime(date).slice(-5)
            res.render('order',
            {classes:classes,name:req.session.name
              ,menu:menu,classing:0,cart:cart,min:min
              ,max:max,time:time,footer:footer,type:type})
          })
        })
      })
    }else{
      res.redirect('/')
    }
  })
})

router.get('/ordering/:class',function(req,res,next){
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    if(req.session.type==2){
      db.all(`select m.name name, c.quantity q, m.price*c.quantity cost, c.menu_id menu_id
      from menu m,cart c where c.user_id = ? and c.menu_id = m.menu_id`
      ,req.session.user,function(err,cart){
        if(err) console.log(err)
        db.all('select * from classes',function(err,classes){
          db.all(`select * from menu
                  where class_id = ? and enable = true order by class_id`,req.params.class
                  ,function(errs,menu){
                    var date = new Date()
  
                    var min = GetDateTime(date)
                    min = min.substring(0,10)
  
                    date.setDate(date.getDate()+1)
                    var max = GetDateTime(date)
                    max = max.substring(0,10)
  
                    date.setHours(date.getHours()+1)
                    var time = GetDateTime(date).slice(-5)
                    res.render('order',
                    {classes:classes, name:req.session.name
                      ,menu:menu, classing:req.params.class
                      ,cart:cart,min:min,max:max,time:time,footer:footer,type:type})
          })
        })
      })
    }else{
      res.redirect('/')
    }
  })
})

router.post('/newCart',function(req,res,next){
  if(req.session.type==2){
    var user = req.session.user
    var menu_id = req.body.newMenu
    var num = req.body.newNum
    db.get(`select quantity from cart where user_id = ? and menu_id = ?`
    ,[user,menu_id],function(err,row){
      if(row){
        db.run(`update cart set quantity = ?
        where user_id = ? and menu_id = ?`,[row.quantity/1+num/1,user,menu_id]
        ,function(err){
          res.redirect('/order/ordering')
        })
      }else{
        db.run(`insert into cart(user_id,menu_id,quantity) 
        values(?,?,?)`,[user,menu_id,num]
        ,function(err){
          res.redirect('/order/ordering')
        })
      }
    })
  }else{
    res.redirect('/')
  }
})

router.get('/delete/:menu_id',function(req,res,next){
  if(req.session.type==2){
    db.run(`delete from cart where user_id = ? and menu_id = ?`
    ,[req.session.user,req.params.menu_id],function(err){
      res.redirect('/order/ordering')
    })
  }else{
    res.redirect('/')
  }
})

router.post('/newOrder',function(req,res,next){
  if(req.session.type==2){
    var user = req.session.user
    var date = req.body.date
    var time = req.body.time

    var now = new Date()
    now.setMinutes(now.getMinutes()+30)
    var now = GetDateTime(now)
    var input = GetDateTime(new Date(date+" "+time))
    if(now<input){
      db.all('select * from cart where user_id = ?',user,function(err,cart){
        if(cart.length!=0){
          db.run('insert into orders(user_id,time,status_id) values(?,?,?)'
          ,[user,date+" "+time,1],function(err){
            var orderId = this.lastID
            cart.forEach((c, i)=> {
              db.run(`insert into order_details(order_id,menu_id,quantity)
              values(?,?,?)`,[orderId,c.menu_id,c.quantity],function(err){
                if(i==cart.length-1){
                  db.run(`delete from cart where user_id = ?`,user,function(err){
                    res.redirect('/')
                  })
                }
              })
            })
          })
        }else{
          res.redirect('/order/ordering')
        }
      })
    }else{
      var type = req.session.type
      db.get('select * from information',function(err,footer){
        res.render('error',{error: "預訂需大於現在半小時",footer:footer,type:type})
      })
    }
    
  }else{
    res.redirect('/')
  }
})

module.exports = router;
