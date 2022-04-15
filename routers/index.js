const express = require('express');
const router  = express.Router();
//we can get to the welcome page 
router.get('/', (req,res)=>{
    res.render('welcome');
})
// you can alse get to the page of register through the path 
//and no the login or logout 
router.get('/register', (req,res)=>{
    res.render('register');
})
router.get('/dashboard',(req,res)=>{
    res.render('dashboard',{
        user: req.user
        });
    })

module.exports = router; 