var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const studentSchema = require('./models/student.model')
const cors = require('cors')



mongoose.set('strictQuery', false);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const studentsRouter = require('./routes/students')
const instructorsRouter = require('./routes/instructors')
const groupsRouter = require('./routes/groups')

var app = express();
app.use(cors())

const url ='mongodb://127.0.0.1:27017/Gomycode' ;
const connect = mongoose.connect(url );
connect.then((db)=>{
  console.log(url);
  console.log('The DataBase is connected with the server nowww ')

}).catch((err)=>{
  console.log("Mongoose Connection Error =" , err.message)
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students' , studentsRouter)
app.use('/instructors' , instructorsRouter)
app.use('/groups' , groupsRouter )

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
