const express = require('express');

const app = express();

const appPort = 5000;
app.listen(appPort,()=>{
    console.log(`App started listening on port ${appPort}`);
});

//Index route
app.get('/',(req, res) => {
    res.send('Welcome to the app homepage!');
})

//About
app.get('/about',(req, res) => {
    res.send('About app!');
});