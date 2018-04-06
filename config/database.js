const mongoURIValue = 'mongodb://localhost/vidjot-dev'
if(process.env.NODE_ENV === 'production'){
    mongoURIValue = 'mongodb://ydswaran:mlabpwd1@ds237379.mlab.com:37379/vidjot-prod'
}

module.exports = {mongoURI:mongoURIValue};