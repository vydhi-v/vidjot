const express = require('express');
const mongoose = require('mongoose');
const brcypt = require('bcryptjs');
//const passport = require('passport');
const router = express.Router();

//Load user model
require('../models/user');
const User = mongoose.model('users');
//login route
router.get('/login', (req,res) => {
    res.render('users/login');
});

//register route GET
router.get('/register', (req,res) => {
    res.render('users/register');
});

//register route POST
router.post('/register', (req,res) => {
    let errors = [];
    if(req.body.password != req.body.password2){
        console.log('Passwords do not match');
        errors.push({
            text:'Passwords do not match'
        });
    }
    if(req.body.password.length<8 || req.body.password2.length<8){
        console.log('<8');
        errors.push({
            text:'Passwords must be at least 8 characters long'
        });
    }
    if(errors.length>0){
        res.render('users/register',{
            errors: errors,
            name: req.body.username,
            email:req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }else{
        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    req.flash('error_msg','Email already registered');
                    res.redirect('/users/register');
                }else{
                    const newUser = new User ({
                        name: req.body.username,
                        email:req.body.email,
                        password: req.body.password
                    });
                    brcypt.genSalt(10,(err, salt) => {
                        brcypt.hash(newUser.password,salt, (err, hash) =>{
                            if(err) throw err;
                            newUser.password = hash;
                            console.log(newUser);
                            newUser
                                    .save()
                                    .then(user => {
                                        req.flash('success_msg','You are now registered and can login!');
                                        res.redirect('/users/login')
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return;
                                    });
                        });
                    });
                }
            });
    }
});

module.exports = router;