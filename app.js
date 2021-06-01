var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signRouter = require('./routes/sign');
var checkRouter = require('./routes/check');
var orderRouter = require('./routes/order');
var editOrderRouter = require('./routes/editOrder');
var informationRouter = require('./routes/information');
const fileUpload = require('express-fileupload')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'ksdjfh8394u9u4hqklur9823',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1800000 }
 })
);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sign', signRouter);
app.use('/check', checkRouter);
app.use('/order', orderRouter);
app.use('/editOrder', editOrderRouter);
app.use('/information', informationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
