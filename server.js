const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Sequelize = require('sequelize');
const app = express();


if ((process.env.IS_PRODUCTION != 'true')){
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.SQLITE_PATH
    });
    sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
} else {
    // postgres
}

// Middleware
app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_SITE,
    credentials: true
}));

app.use((req, res, next) => {
    if (req.cookies.access_token){
        try {
            const token = req.cookies.access_token;
            const decoded = jwt.verify(token, process.env.COOKIE_SECRET);
            console.log(decoded);
            
        } catch (err) {
            res.redirect('/');
            next(err);
        }
    }
    next();
});


// View engine
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname+'/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Helper functions
function doLogin(email, password){
    if(email === "asd@asd.com" && password === "asd"){
        return true
    }
    return false
}

function doRegister(username, email, password){
    const users = ["test"];
    if (!(email in users)){
        return true
    }
    return false
}

// Routes
app.get('/', (req, res)=>{
    res.render('home', {
        title: "Home",
        isLoggedIn: false
    });
});

app.get('/blog', (req, res)=>{
    res.render('blog',{
        title: "Blog",
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
        if(doRegister(req.body.username, req.body.email, req.body.password)){
            res.redirect('/');
        } else {
            res.redirect('/register');
        }
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
        if(doLogin(req.body.email, req.body.password)){
            const payload = {
                email: req.body.email 
            }
            const token = jwt.sign(payload, process.env.COOKIE_SECRET);
            res.cookie('access_token', token,{
                maxAge: 900000, 
                httpOnly: true,
                secure: (process.env.IS_PRODUCTION == 'true'? true : false)
            });
            res.redirect('/');
        } else {
            res.redirect('/login');    
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res)=>{
    req.clearCookie('access_token');
    res.redirect('/');
});

// Start server
app.listen(3000, ()=>{
    console.log("Listening on port 3000")
});