const express = require('express');
const router = express.Router();
const User = require("../models/user.js") 
const bcrypt = require('bcryptjs');
const passport = require('passport');
//login handle
router.get('/login',(req,res)=>{
    res.render('login'); 
})
router.get('/register',(req,res)=>{
    res.render('register') 
    })

//Register handle
router.post('/register',(req,res)=>{
    //req for request and res is the respond 
    //possible cases : he don't fill all the forme 
    const {name,email,password,password2} = req.body ; 
    let errors =[] ;  //creates a list that contains all the errors posssible and then 
    console.log ('Name'+name + 'email :'+ email + 'pass :' + password) ; // voir les paramètre déja affectés 
    if (!name || !email || !password || !password2) {
        errors.push ({msg:"please fill in all fields"})
    }
    //check if match 
    if (password != password2) {
        errors.push({msg:"password don't match"});
    }
    //check if password is more than 6 characteres 
    if (password.length < 6 ) {
        errors.push({msg:"password at least 6 characters"})
    }
    //s'il y 'a plus qu'une erreur on doit reafficher la page 
    if (errors.length>0) {
        //object .render 2 possible elements 
        res.render('register' ,{errors: errors,name : name, email : email,password : password,password2 : password2})
    } 
    else  {
        //validattion of type of data passed arraw expression
        User.findOne({email : email}).exec( (err,user)=>{ 
            console.log(user);   
            if(user) {
                errors.push({msg: 'email already registered'});
                res.render('register' ,{errors: errors,name : name, email : email,password : password,password2 : password2})
            
            } else {
                //création d'un nouveau utilisateur 
                const newUser = new User({
                    name : name,
                    email : email,
                    password : password
                });
                bcrypt.genSalt(10,(err,salt)=> 
                    bcrypt.hash(newUser.password,salt ,(err,hash)=> {
                    if(err) throw err;
                    //save pass to hash
                    newUser.password = hash;
                    //save user
                    newUser.save().then((value)=>{
                        console.log(value)
                        //new value 
                        req.flash('success_msg','You have now registered!')
                        res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
        })
    }    
}) 

router.post ('/login', (req,res,next) => {
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
        })(req,res,next);
})
//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
 })

module.exports = router;