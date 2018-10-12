const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

// custom import
const Client = require('./route/client');

app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
mongoose.Promise = global.Promise;

// connection to mongodb 
mongoose.connect('mongodb://samratdey:yellowmonk87@ds231133.mlab.com:31133/generic');
mongoose.connection
	.once('open', () => console.log('mongoose is good to go!'))
	.on('error', (error) => console.warn(error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname, 'view')));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
  next();
});

Client(app);

// admin
app.get('/dashboard', (req, res) => res.render('dashboard'));
app.get('/dashboard/**', (req, res) => res.render('dashboard'));

// website
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/', (req, res) => res.render('index'));
app.get('**', (req, res) => res.redirect('/'));

// handle error
app.use((err, req, res, next) => {
	res.status(422).send({ error: err.message });
});

module.exports = app;