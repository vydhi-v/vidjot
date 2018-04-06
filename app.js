
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

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
    //console.log('method override');
    next();
});

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flas middleware
app.use(flash());

//globals
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    //If logged in successfully update global with user info otherwise set to null
    res.locals.user = req.user || null; 
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

//Map URLs to routes
app.use('/ideas',ideas);
app.use('/users',users);

//Static resource directory
app.use(express.static(path.join(__dirname,'public')));