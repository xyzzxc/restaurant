var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./public/data/order.db')

db.run(`create table if not exists menu(
    menu_id integer not null primary key autoincrement,
    name text not null,
    content text not null,
    class_id integer not null,
    price integer not null,
    subName text not null,
    enable boolean not null,
    FOREIGN KEY (class_id) REFERENCES classes (class_id)
)`)

db.run(`create table if not exists classes(
    class_id integer not null primary key autoincrement,
    class text not null
)`)

db.run(`create table if not exists users(
    user_id integer not null primary key autoincrement,
    email text not null,
    password text not null,
    name text not null,
    phone text not null,
    type_id integer not null,
    FOREIGN KEY (type_id) REFERENCES types (type_id)
)`)

db.run(`create table if not exists orders(
    order_id integer not null primary key autoincrement,
    user_id integer not null,
    time datetime not null,
    status_id integer not null,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    FOREIGN KEY (status_id) REFERENCES status (status_id)
)`)

db.run(`create table if not exists order_details(
    order_id integer not null,
    menu_id integer not null,
    quantity integer not null,
    PRIMARY KEY(order_id, menu_id),
    FOREIGN KEY (order_id) REFERENCES orders (order_id)
    FOREIGN KEY (menu_id) REFERENCES menu (menu_id)
)`)

db.run(`create table if not exists cart(
    user_id integer not null,
    menu_id integer not null,
    quantity integer not null,
    PRIMARY KEY(user_id, menu_id),
    FOREIGN KEY (user_id) REFERENCES user (user_id)
    FOREIGN KEY (menu_id) REFERENCES menu (menu_id)
)`)

db.run(`create table if not exists seats(
    seat_id integer not null primary key autoincrement,
    user_id text,
    time datetime,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
)`)

db.run(`create table if not exists types(
    type_id integer not null primary key autoincrement,
    type text not null
)`)

db.run(`create table if not exists status(
    status_id integer not null primary key autoincrement,
    status text not null
)`)

db.run(`create table if not exists information(
    address text not null,
    phone text not null,
    fb text not null,
    ig text not null
)`)

var GetDateTime = function A(date){
    if(typeof date == 'object'){
        var a = date.getFullYear() + '-' +
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' + 
        ('00' + date.getHours()).slice(-2) + ':' + 
        ('00' + date.getMinutes()).slice(-2)
        return a
    }else{
        return '只能傳入日期物件'
    }
}

module.exports = {db:db,GetDateTime:GetDateTime};