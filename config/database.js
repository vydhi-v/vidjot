if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://ydswaran:mlabpwd1@ds237379.mlab.com:37379/vidjot-prod'};
}else{
    module.exports = {mongoURI:'mongodb://localhost/vidjot-dev'};
}

 