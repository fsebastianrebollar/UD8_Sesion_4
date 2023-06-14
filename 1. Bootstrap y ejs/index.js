const express = require('express'); 
const app = express();
app.set('view engine', 'ejs');

const path = require('path')
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/images', express.static(path.join(__dirname, 'views/images')))
    
app.get('/', (req, res) => {        
    res.render('index', {
        page_title: "Bienvenido a ONTinfo",
    });
});

app.get('/weather', (req, res) => {        
    res.render('weather', {
        page_title: "El tiempo",
    });
});

app.get('/comments', (req, res) => {        
    res.render('comments', {
        page_title: "Comentarios",
    });
});

app.get('/login', (req, res) => {        
    res.render('login', {
        page_title: "Entrar",
    });
});

app.get('/register', (req, res) => {        
    res.render('register', {
        page_title: "Regístrate",
    });
});

app.listen(3000, () => {       
    console.log("Servidor escuchando en el puerto 3000"); 
});