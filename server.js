const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const app = express();

// Middleware
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({extended: true}));

// View engine
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname+'/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// Routes
app.get('/', (req, res)=>{
    res.render('index', {
        title: "Hello",
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    });
});

app.get('/register', (req, res)=>{
    res.render('register',{
        title: "Register"
    });
});

app.post('/register', (req, res)=>{
    if(req.body){
        console.log(req.body);
        res.redirect('/');
    } else {
        res.redirect('/register');
    }
});

app.get('/login', (req, res)=>{
    res.render('login',{
        title: "Login"
    });
});

app.post('/login', (req, res)=>{
    if(req.body){
        console.log(req.body);
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// Start server
app.listen(3000, ()=>{
    console.log("Listening on port 3000")
});