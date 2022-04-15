const express = require('express'); //
const app = express(); //app est une fonction d'affichage 
const router = express.Router();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require("./config/passport")(passport)
//mongoose
mongoose.connect('mongodb://localhost:27017/myapp',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err));
//EJS embedded java script 
app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true
 })); 

app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req,res,next)=> {

  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
  next();
})
app.use('/',require('./routers/index')); //on a pu remodifier le path vers / au lieu de ./routers/index 
app.use('/users',require('./routers/user'));
app.listen(3000); 