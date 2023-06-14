const express = require('express'); 
const app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const session = require("express-session");
app.use(session({
    secret: "1234",
    saveUninitialized: true,
    resave: true,
}));

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const User = require('./models/user');
const Comment = require('./models/comment');

mongoose.connect('mongodb+srv://root:root@cluster0.6bozca9.mongodb.net/sesion_4?retryWrites=true&w=majority')
    .catch(err => console.log(err))
    .then(console.log("Connected to MongoDB"));

const path = require('path')
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/images', express.static(path.join(__dirname, 'views/images')))

var request = require("request");
    
app.get('/', (req, res) => {      
    res.render('index', {
        page_title: "Bienvenido a ONTinfo",
        user_email: req.session.email
    });
});

app.get('/weather', (req, res) => {  
    const lat = 38.84
    const lon = -0.6
    const appid = 'b7d03ede3b0318765e1f3ecb51ec8068'  
    request.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + appid, 
        (error, response, body) => {
            if (error) {
                console.log(error);
                res.redirect('/')
                return
            }
            json = JSON.parse(body)
            temp = (json.main.temp - 273.15).toFixed(1)
            temp_max = (json.main.temp_max - 273.15).toFixed(1)
            temp_min = (json.main.temp_min - 273.15).toFixed(1)
            humidity = json.main.humidity
            weather = json.weather[0].main

            weather_data = {
                temp: temp,
                temp_max: temp_max,
                temp_min: temp_min,
                humidity: humidity,
                weather: weather
            }

            res.render('weather', {
                page_title: "El tiempo",
                user_email: req.session.email,
                weather_data:weather_data
            });
        })
});

app.get('/comments', (req, res) => {   
    Comment.find({}).sort({dt: -1}).limit(10)
        .then(comments => {
            res.render('comments', {
                page_title: "Comentarios",
                user_email: req.session.email,
                comments: comments,
            });
        })
        .catch(error => {
            console.log(error)
            res.redirect("/")
        })
    
});

app.post('/comments', (req, res) => {  
    
    const email = req.body.email
    const comment = req.body.comment

    new_comment = new Comment({user_email:email, comment:comment})
    new_comment.save()
        .then(_ => {
            console.log("save")
            res.redirect("/comments")
        })
        .catch(error => {
            console.log(error)
            console.log("error")
            res.redirect("/comments")
        })
    
});

app.get('/login', (req, res) => {  
    if (req.session.email != undefined) {
        res.redirect("/")
        res.end()
        return
    }  

    res.render('login', {
        page_title: "Entrar",
        user_email: req.session.email
    });
});

app.post('/login', (req, res) => {  

    const email = req.body.email
    const password = req.body.password

    if (email && password) {
        User.findOne({email:email, password:password})
            .then(user => {
                if (user) {
                    req.session.email = email
                    res.redirect('/')
                    res.end()
                } else {
                    res.redirect('/login')
                    res.end()
                }
            })
            .catch(error => {
                console.log(error)
                res.redirect('login')
                res.end()
            })
        
    } else {
        res.redirect('/login')
        res.end()
    }
});

app.get('/register', (req, res) => {   
    if (req.session.email != undefined) {
        res.redirect("/")
        res.end()
        return
    }

    res.render('register', {
        page_title: "Regístrate",
        user_email: req.session.email
    });
});

app.post('/register', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (email && password) {
        const new_user = new User({email:email, password:password})
        new_user.save()
            .then(user => {
                res.redirect('/login')
                res.end()
            })
            .catch(error => {
                console.log(error)
                res.redirect('/register')
                res.end()
            })
    } else {
        res.redirect('/register')
        res.end()
    }
});

app.get('/logout', (req, res) => {     
    req.session.email = undefined   
    res.redirect('/')
});

app.listen(3000, () => {       
    console.log("Servidor escuchando en el puerto 3000"); 
});