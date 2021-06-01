var express = require('express');
var router = express.Router();
var db = require('../db').db
var GetDateTime = require('../db').GetDateTime
var fs = require('fs')

router.route('/newMenu')
.get((req,res,next) =>{
    var name = req.session.name
    var type = req.session.type
    db.get('select * from information',function(err,footer){
        if(type==1){
            db.all(`select * from classes`,function(err,classes){
                res.render('newMenu',{classes:classes,name:name,footer:footer,type:type})
            })
        }else{
            res.redirect('/')
        }
    })
})
.post((req,res,next) =>{
    var type = req.session.type
    db.get('select * from information',function(err,footer){
        if(!req.files || Object.keys(req.files).length == 0){
            return res.render('error',{error: "檔案上傳失敗",footer:footer,type:type})
        }
        var name = req.body.name
        var photo = req.files.photo
        var content = req.body.content
        var price = req.body.price
        var classes = req.body.classes
    
        var pn = photo.name
        if(!pn.includes('.jpg') && !pn.includes('.jpeg') && !pn.includes('.png') && !pn.includes('.gif')){
            return res.render('error',{error: "只能jpg、jpeg、png、gif",footer:footer,type:type})
        }
        pn = pn.substring(pn.indexOf('.'))
    
        db.get(`select menu_id from menu where name = ?`,name,function(err,row){
            if(!row){
                db.run(`insert into menu(name,content,class_id,price,subName,enable)
                values(?,?,?,?,?,?)`,[name,content,classes,price,pn,true],function(err){
                    if(err) console.log(err)
                    photo.mv('./public/menu/'+this.lastID+pn,function(err){
                        if(err) console.log(err)
                        res.redirect('/')
                    })
                })
            }else{
                return res.render('error',{error: "已經有此餐點",footer:footer,type:type})
            }
        })
    })
})

router.route('/editMenu/:menuID')
.get((req,res,next)=>{
    var name = req.session.name
    var type = req.session.type
    var menuID = req.params.menuID
    db.get('select * from information',function(err,footer){
        if(type==1){
            db.all(`select * from classes`,function(err,classes){
                db.get(`select * from menu where menu_id=?`,menuID,function(err,menu){
                    res.render('editMenu',{classes:classes,name:name,menu:menu,footer:footer,type:type})
                })
            })
        }else{
            res.redirect('/')
        }
    })
})
.post((req,res,next)=>{
    var name = req.body.name
    var price = req.body.price
    var content = req.body.content
    var classes = req.body.classes
    var menuID = req.params.menuID

    db.get(`select * from menu where menu_id=?`,menuID,function(err,menu){
        db.get(`select menu_id from menu where name = ?`,name,function(err,row){
            if(!row || name==menu.name){
                if(!req.files || Object.keys(req.files).length == 0){          
                    db.run('update menu set name = ?, price = ?,content = ?,class_id = ? where menu_id =?'
                    ,[name,price,content,classes,menuID],function(err){
                        res.redirect('/')
                    })
                }else{
                    var photo = req.files.photo
                    var pn = photo.name
                    pn = pn.substring(pn.indexOf('.'))
                    fs.unlink('./public/menu/'+menu.menu_id+menu.subName,function(err){
                        photo.mv('./public/menu/'+menu.menu_id+pn,function(err){
                            db.run('update menu set name = ?, price = ?,content = ?,class_id = ?,subName = ? where menu_id =?'
                                ,[name,price,content,classes,pn,menuID],function(err){
                                    res.redirect('/')
                                })
                        })
                    })
                }
            }else{
                var type = req.session.type
                db.get('select * from information',function(err,footer){
                    return res.render('error',{error: "已經有此餐點",footer:footer,type:type})
                })
            }
        })
    })
})

router.get('/enableMenu/:menuID/:enable',(req,res,next)=>{
    var type = req.session.type
    var menuID = req.params.menuID
    var enable = req.params.enable
    if(type==1){
        db.get(`select * from menu where menu_id=?`,menuID,function(err,menu){
            if(menu){
                db.run(`update menu set enable = ? where menu_id =?`,[enable,menuID],function(err){
                    if(err) console.log(err)
                    res.redirect('/')
                })
            }else{
                res.redirect('/')
            }
        })
    }else{
        res.redirect('/')
    }
})

router.route('/editFooter')
.get((req,res,next)=>{
    var type = req.session.type
    var name = req.session.name
    db.get('select * from information',function(err,footer){
      if(type==1){
        res.render('editFooter',{footer:footer,type:type,name,name})
      }else{
          res.redirect('/')
      }
    })
}).post((req,res,next)=>{
    var address = req.body.address
    var phone = req.body.phone
    var fb = req.body.fb
    var ig = req.body.ig
    db.run(`update information set address=?, phone=?, fb=?, ig=?`
    ,[address,phone,fb,ig],function(err){
        res.redirect('/')
    })
})

module.exports = router;