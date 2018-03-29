
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//import express from express;
//import exphbs from express-handlebars;

const app = express();
//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Connect to Mongoose
    //,{
    //  useMongoClient: true
    //}
    //No longer necessary with latest Mongoose version
mongoose.connect('mongodb://localhost/vidjot-dev')
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));

//Load idea model
require('./models/idea');
const Idea = mongoose.model('ideas');

const appPort = 5000;

//Middleware general example 
app.use((req, res, next) => {
    req.name = 'TestNameParam';
    next();
});

//Handlebars middleware setup
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));

app.set('view engine','handlebars');

//Bpodyparser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'),(req, res, next)=>{
    console.log('method override');
    next();
});


app.listen(appPort,()=>{
    console.log(`App started listening on port ${appPort}`);
});

//Index route
app.get('/',(req, res) => {
    console.log(`Logging name from requst -  ${req.name}`);
    const label = 'Welcome';
    res.render('index',{
        label: label
    });
})

//About
app.get('/about',(req, res) => {
    res.render('about');
});

//Add idea form
app.get('/ideas/add',(req, res) => {
    res.render('ideas/add');
});

//Save idea
app.post('/ideas',(req,res) => {
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
        //res.send('valid info!');
        new Idea({
                    title: req.body.title,
                    details: req.body.details
        })
        .save()
        .then(idea => {
            res.redirect('/ideas');
        });
    }
});

//Retrieve idea(s)
app.get('/ideas',(req,res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        });
    
});

//Render edit idea form
app.get('/ideas/edit/:id', (req,res) => {
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
app.put('/ideas/:id',(req,res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            });
    });    
});