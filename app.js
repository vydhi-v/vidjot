const express = require('express');

const app = express();
const appPort = 5000;

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
    res.send('Welcome to the app homepage!');
})

//About
app.get('/about',(req, res) => {
    res.send('About app!');
});

