var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(
    () => console.log('Connected correctly to the server'), 
    err => console.log(err)) // Second argument gives function to run if there's an error. Useful if there is no further chain

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('e5th4b643645*#jf491'));

// Authentication happens here
const auth = (req, res, next) => {
    if (!req.signedCookies.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('You are not authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err)
        }
    
        // If there is an authHeader, deconstruct/decode the user and password and check it
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const [user, password] = auth;
        if (user === 'admin' && password === 'password') {
            res.cookie('user', 'admin', {signed: true, maxAge: 60000})
    
    
            return next();
        } else {
            const err = new Error('You are not authenticared');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err)
        }
    } else {
        if (req.signedCookies.user === 'admin') {
            return next();
        } else {
            const err = new Error('You are not authenticared');
            err.status = 401;
            return next(err)
        }
    }


}
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/partners', partnerRouter);
app.use('/promotions', promotionRouter);

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
