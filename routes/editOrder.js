var express = require('express');
var router = express.Router();
var db = require('../db').db
var GetDateTime = require('../db').GetDateTime

var date = new Date()
date.setMinutes(date.getMinutes()+30)
date = GetDateTime(date)

/* GET users listing. */
router.get('/', function(req, res, next) {
  var type = req.session.type
  var name = req.session.name
  var user = req.session.user

  var shows = []
  db.get('select * from information',function(err,footer){
    db.all(`select * from status`,function(err,status){
      if(type==2){
        db.all(`select u.name name,u.phone phone,o.time time,o.order_id order_id,s.status status,o.status_id status_id
        from orders o,users u,status s where o.user_id = ? and o.user_id=u.user_id and o.status_id=s.status_id order by o.time`
        ,user,function(err,orders){
          if(orders.length!=0){
            orders.forEach((o) =>{
              db.all(`select m.name name,o.quantity q,m.price*o.quantity cost
              from menu m,order_details o where o.order_id = ? and o.menu_id = m.menu_id order by m.class_id`
              ,[o.order_id],function(err,details){
                shows.push({order:o,details:details})
                if(shows.length==orders.length){
                  shows.sort(function(a,b){
                    if(a.order.time>b.order.time) return -1
                    if(a.order.time<b.order.time) return 1
                    else return 0
                  })
                  res.render('watchOrder',{shows:shows,name:name,type:type,date:date,status:status,footer:footer})
                }
              })
            })
          }else{
            res.render('watchOrder',{shows:shows,name:name,type:type,footer:footer,status:status})
          }
        })
      }else if(type==1){
        db.all(`select u.name name,u.phone phone,o.time time,o.order_id order_id,s.status status,o.status_id status_id
        from orders o,users u,status s where o.user_id=u.user_id and o.status_id=s.status_id order by o.time`
        ,function(err,orders){
          if(orders.length!=0){
            db.all(`select * from status`,function(err,status){
              orders.forEach((o) =>{
                db.all(`select m.name name,o.quantity q,m.price*o.quantity cost
                from menu m,order_details o where o.order_id = ? and o.menu_id = m.menu_id order by m.class_id`
                ,[o.order_id],function(err,details){
                  shows.push({order:o,details:details})
                  if(shows.length==orders.length){
                    shows.sort(function(a,b){
                      if(a.order.time>b.order.time) return -1
                      if(a.order.time<b.order.time) return 1
                      else return 0
                    })
                    res.render('watchOrder',{shows:shows,name:name,type:type,date:date,status:status,footer:footer})
                  }
                })
              })
            })
          }else{
            res.render('watchOrder',{shows:shows,name:name,type:type,date:date,footer:footer,status:status})
          }
        })
      }else{
        res.redirect('/')
      }
    })
  })
});

router.get('/edit/:orderID',function(req,res,next){
  var type = req.session.type
  var orderID = req.params.orderID
  var user = req.session.user
  db.get('select * from information',function(err,footer){
    db.get(`select order_id,user_id,time from orders where order_id = ? and status_id=1`,orderID,function(err,row){
      if(row && row.time > date && row.user_id==user){
        db.all(`select m.name name, o.quantity q, m.price*o.quantity cost, o.menu_id menu_id
        from menu m,order_details o where o.order_id = ? and o.menu_id = m.menu_id`
        ,row.order_id,function(err,order_details){
          db.all('select * from classes',function(err,classes){
            db.all(`select * from menu where enable = true order by class_id`,function(errs,menu){
              var now = new Date()
  
              var min = GetDateTime(now)
              min = min.substring(0,10)
  
              now.setDate(now.getDate()+1)
              var max = GetDateTime(now)
              max = max.substring(0,10)
  
              now.setHours(now.getHours()+1)
              var time = GetDateTime(now).slice(-5)
              res.render('editOrder',
              {classes:classes,name:req.session.name
                ,menu:menu,classing:0,order_details:order_details
                ,min:min,max:max,time:time,orderID:orderID,footer:footer,type:type})
            })
          })
        })
      }else{
        res.render('error',{error: "沒這訂單，或處理中、已完成，或太遲了，或你不是本人",footer:footer,type:type})
      }
    })
  })
})
router.get('/edit/:orderID/:nowClass',function(req,res,next){
  var type = req.session.type
  var orderID = req.params.orderID
  var user = req.session.user
  var nowClass = req.params.nowClass
  db.get('select * from information',function(err,footer){
    db.get(`select order_id,user_id,time from orders where order_id = ? and status_id=1`,orderID,function(err,row){
      if(row && row.time > date && row.user_id==user){
        db.all(`select m.name name, o.quantity q, m.price*o.quantity cost, o.menu_id menu_id
        from menu m,order_details o where o.order_id = ? and o.menu_id = m.menu_id`
        ,row.order_id,function(err,order_details){
          db.all('select * from classes',function(err,classes){
            db.all(`select * from menu
                  where class_id = ? and enable = true order by class_id`,nowClass
                  ,function(errs,menu){
                    var now = new Date()
  
                    var min = GetDateTime(now)
                    min = min.substring(0,10)
  
                    now.setDate(now.getDate()+1)
                    var max = GetDateTime(now)
                    max = max.substring(0,10)
  
                    now.setHours(now.getHours()+1)
                    var time = GetDateTime(now).slice(-5)
                    res.render('editOrder',
                    {classes:classes,name:req.session.name
                      ,menu:menu,classing:nowClass,order_details:order_details
                      ,min:min,max:max,time:time,orderID:orderID,footer:footer,type:type})
            })
          })
        })
      }else{
        res.render('error',{error: "沒這訂單，或處理中、已完成，或太遲了，或你不是本人",footer:footer,type:type})
      }
    })
  })
})

router.post('/newDetail/:orderID',function(req,res,next){
  var orderID = req.params.orderID
  var user = req.session.user
  var menu_id = req.body.newMenu
  var num = req.body.newNum
  db.get(`select order_id,user_id,time from orders where order_id = ? and status_id=1`,orderID,function(err,row){
    if(row && row.time > date && row.user_id==user){
      db.get(`select quantity from order_details where order_id = ? and menu_id = ?`
      ,[orderID,menu_id],function(err,row){
        if(!row){
          db.run(`insert into order_details(order_id,menu_id,quantity)
          values(?,?,?)`,[orderID,menu_id,num],function(errs){
            if(errs) console.log(errs)
            res.redirect('/editOrder/edit/'+orderID)
          })
        }else{
          db.run(`update order_details set quantity = ? where order_id = ? and menu_id = ?`
          ,[row.quantity/1+num/1,orderID,menu_id],function(errs){
            if(errs) console.log(errs)
            res.redirect('/editOrder/edit/'+orderID)
          })
        }
      })
    }else{
      var type = req.session.type
      db.get('select * from information',function(err,footer){
        res.render('error',{error: "沒這訂單，或處理中、已完成，或太遲了，或你不是本人",footer:footer,type:type})
      })
    }
  })
})

router.get('/delDetail/:orderID/:menu_id',function(req,res,next){
  var orderID = req.params.orderID
  var user = req.session.user
  var menu_id = req.params.menu_id
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.get(`select order_id,user_id,time from orders where order_id = ? and status_id=1`,orderID,function(err,row){
      if(row && row.time > date && row.user_id==user){
        db.run(`delete from order_details where order_id = ? and menu_id = ?`
        ,[orderID,menu_id],function(err){
          res.redirect('/editOrder/edit/'+orderID)
        })
      }else{
        res.render('error',{error: "沒這訂單，或處理中、已完成，或太遲了，或你不是本人",footer:footer,type:type})
      }
    })
  })
})

router.post('/time/:orderID',function(req,res,next){
  var orderID = req.params.orderID
  var user = req.session.user
  var newdate = req.body.date
  var time = req.body.time
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.get(`select order_id,user_id,time from orders where order_id = ? and status_id=1`,orderID,function(err,row){
      if(row && row.time > date && row.user_id==user){
        var input = GetDateTime(new Date(newdate+" "+time))
        if(date<input){
          db.run(`update orders set time = ? where order_id = ?`
          ,[newdate+" "+time,orderID],function(err){
            res.redirect('/editOrder/')
          })
        }else{
          res.render('error',{error: "預訂需大於現在半小時",footer:footer,type:type})
        }
      }else{
        res.render('error',{error: "沒這訂單，或處理中、已完成，或太遲了，或你不是本人",footer:footer,type:type})
      }
    })
  })
})

router.get('/delOrder/:orderID',function(req,res,next){
  var orderID = req.params.orderID
  var user = req.session.user
  var type = req.session.type
  db.get('select * from information',function(err,footer){
    db.get(`select order_id,user_id,time from orders where order_id = ? and status_id=1`,orderID,function(err,row){
      if(row && row.time > date && row.user_id==user){
        db.run(`delete from orders where order_id = ?`,orderID,function(err){
          db.run(`delete from order_details where order_id = ?`,orderID,function(err){
            res.redirect('/editOrder')
          })
        })
      }else{
        res.render('error',{error: "沒這訂單，或處理中、已完成，或太遲了，或你不是本人",footer:footer,type:type})
      }
    })
  })
})

router.get('/status/:orderID/:status',function(req,res,next){
  var orderID = req.params.orderID
  var status = req.params.status
  var type = req.session.type
  if(type==1){
    db.run(`update orders set status_id = ? where order_id = ?`,[status,orderID],function(err){
      res.redirect('/editOrder')
    })
  }else{
    res.redirect('/')
  }
})

module.exports = router;
