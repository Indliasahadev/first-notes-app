const path = require('path');
const express = require('express');
const hbs = require('hbs');

// console.log(bootstrap.Modal);

const app = express();

const port = process.env.PORT || 30002

//setup path for express config
const publicPathDirectory = path.join(__dirname, '../public');
const viewspath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

//setup static directory to serve
app.use(express.static(publicPathDirectory));

//setup for handlebars and viewspath
app.set('view engine', 'hbs');
app.set('views', viewspath);
hbs.registerPartials(partialsPath);

app.get('', (req, res)=>{
    res.render('index', {
        heading : 'Notes App',
        name : 'Sahadev Indlia'
    })
});

app.get('/index', (req, res)=>{
    res.render('index', {
        heading : 'Notes App'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        heading : 'About Page'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        heading : 'Help Page'
    })
})

app.get('/add-note', (req, res)=>{
    res.render('addNote', {
        heading : 'New Note'
    })
})

app.get('/note-details', (req, res)=>{
    res.render('noteDetails', {
        heading : 'Title ',
        title : req.query.address
    })
})


app.listen(port, ()=>{
    console.log('Server is up on '+ port);
})