const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
//Load idea model
require('../models/idea');
const Idea = mongoose.model('ideas');

//Add idea form
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Save idea
router.post('/', ensureAuthenticated, (req,res) => {
    console.log(req.body);
    let errors = [];
    if(!req.body.details){
        errors.push({text:'Please add details'});
    }
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(errors.length>0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else{        
        new Idea({
                    title: req.body.title,
                    details: req.body.details
        })
        .save()
        .then(idea => {
            req.flash('success_msg','Project Idea saved!');
            res.redirect('/');
        });
    }
});

//Retrieve idea(s)
router.get('/', ensureAuthenticated, (req,res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
    
});

//Render edit idea form
router.get('/edit/:id', ensureAuthenticated, (req,res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit',{
                idea:idea
            });
        });
});

//Edit form process
router.put('/:id', ensureAuthenticated, (req,res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg','Project Idea saved!')
                res.redirect('/');
            });
    });    
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id:req.params.id})
        .then(() => {
            req.flash('success_msg','Project Idea removed!')
            res.redirect('/');
        });
});

module.exports = router;