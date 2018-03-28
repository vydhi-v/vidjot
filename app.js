
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
//import express from express;
//import exphbs from express-handlebars;

const app = express();
//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev'
    //,{
    //useMongoClient: true
    //}
    //No longer necessary with latest Mongoose version
)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
//Load idea model
require('./models/idea');
const idea = mongoose.model('ideas');

const appPort = 5000;

app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));

app.set('view engine','handlebars');


app.use((req, res, next) => {
    req.name = 'TestNameParam';
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
    res.send('ok');
});