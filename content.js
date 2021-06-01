var db = require('./db').db
var GetDateTime = require('./db').GetDateTime

db.run(`insert into classes(class) values("主餐")`,function(err){
    db.run(`insert into classes(class) values("甜點")`,function(err){
        db.run(`insert into classes(class) values("飲料")`)
    })
})

db.run(`insert into types(type) values("員工")`,function(err){
    db.run(`insert into types(type) values("顧客")`)
})

db.run(`insert into status(status) values("尚未處理")`,function(err){
    db.run(`insert into status(status) values("處理中")`,function(err){
        db.run(`insert into status(status) values("已完成")`)
    })
})

db.run(`insert into information(address,phone,fb,ig) values("宜蘭市台北區台灣路地球巷","0000-000-000","#","#")`)

db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)
db.run(`insert into seats(user_id,time) values(null,null)`)

const bcrypt = require('bcrypt')
const salt = 10;

bcrypt.hash("1",salt,function(err,hash){
    db.run(`insert into users(email,password,name,phone,type_id) values("1@1","${hash}","員工","",1)`)
})