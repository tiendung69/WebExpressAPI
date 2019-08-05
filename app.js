var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var studentRouter = require('./routes/student');

var testScriptRouter = require('./routes/testScript');

var testClassRouter = require('./routes/testClass');

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/student', studentRouter);
app.use('/test-template', testScriptRouter);
app.use('/test-class',testClassRouter);



app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

var MONGODB_HOST = 'localhost';
var MONGODB_PORT = 27017;
var MONGODB_DATABASE = 'manage_student';


// mongoose.connect(
//     `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`,
//     { useNewUrlParser: true }
// ).then(() => {
//     console.log("Connect DB Successfull");
// });

// mongoose.set('useFindAndModify', false);

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
