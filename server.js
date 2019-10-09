var env = require('dotenv').config();
var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');
var app = express();

app.use('/static', express.static(path.join(__dirname, '/public')))
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname+'/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (req, res)=>{
    res.render('index', {
        title: "Hello"
    });
});

app.listen(3000, ()=>{
    console.log("Listening on port 3000")
});