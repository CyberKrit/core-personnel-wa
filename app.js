const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('./config/config');
const stripe = require('stripe')(config.stripeSecretkey);

// import route
const User = require('./route/user');
const AbandonedSubs = require('./route/abandoned-subscription');
const Subscription = require('./route/subscription');
const Dashboard = require('./route/dashboard');


const smtpTransport = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');

app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
mongoose.Promise = global.Promise;

// connection to mongodb 
mongoose.connect(config.mongodbURL, { useCreateIndex: true, useNewUrlParser: true, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000 });
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

User(app);
AbandonedSubs(app);
Subscription(app);
Dashboard(app);

// admin
// app.get('/dashboard', (req, res) => res.render('dashboard'));
// app.get('/dashboard/**', (req, res) => res.render('dashboard'));

// website
app.get('/login', (req, res) => res.render('pages/login'));
app.get('/signup', (req, res) => res.render('pages/signup', { STRIPE_API_KEY: config.stripePublishablekey, PWD_MIN_LENGTH: config.pwdMinLength, CLIENT_TIMEOUT: config.clientTimeout }));
app.get('/forget-password', (req, res) => res.render('pages/forget-password'));
app.get('/reset-password', (req, res) => res.render('pages/reset-password'));
app.get('/email-verification', (req, res) => res.render('pages/email-verification'));
app.get('/e', (req, res) => {

	var fullUrl = req.protocol + '://' + req.get('host') ;
	console.log(fullUrl);
	

});



app.post('/dashboard', (req, res) => {

	// console.log(req.body);
	// const amount = 132;

	// stripe.charges.create({
 //    amount,
 //    currency: 'usd',
 //    customer: 'cus_Dn8NmfUiGfTnsu'
 //  })
 //  .then(function(charge) {
	//   res.send({ status: true });
	// })
	// .catch(function(err) {
	//   res.status(422).send({ error: err.message });
	// });

	// stripe.customers.create({
	//   email: 'mail.1238.sam@gmail.com'//req.body.stripeEmail
	// })
	// .then(function(customer){console.log(customer.id);
	//   return stripe.customers.createSource(customer.id, {
	//     source: req.body.stripeToken
	//   });
	// })
	// .then(function(source) {
	//   return stripe.charges.create({
	//     amount,
	//     currency: 'usd',
	//     customer: source.customer
	//   });
	// })
	// .then(function(charge) {
	//   res.send({ status: true });
	// })
	// .catch(function(err) {
	//   res.status(422).send({ error: err.message });
	// });

});
app.get('/', (req, res) => res.render('index'));
app.get('**', (req, res) => res.redirect('/'));

// handle error
app.use((err, req, res, next) => {
	res.status(422).send({ error: err.message, data: err });
});

module.exports = app;