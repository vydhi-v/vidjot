const express = require('express');
const router = express.Router();

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
    console.log(req.body);
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
        res.send('registration success');
    }
    //res.send('register');
});

module.exports = router;