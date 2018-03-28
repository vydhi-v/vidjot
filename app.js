
const express = require('express');
const exphbs = require('express-handlebars');
//import express from express;
//import exphbs from express-handlebars;

const app = express();
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

