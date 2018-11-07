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
const InductionCat = require('./route/induction-cat');
const Induction = require('./route/induction');
const NonApi = require('./route/non-api');

app.use('/', express.static(__dirname + '/public/app-assets'));
app.use('/web-assets', express.static(__dirname + '/public/web-assets'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
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
InductionCat(app);
Induction(app);
NonApi(app);

// website

app.get('/login', (req, res) => res.render('pages/login', {
	STRIPE_API_KEY: config.stripePublishablekey,
	PWD_MIN_LENGTH: config.pwdMinLength, 
	CLIENT_TIMEOUT: config.clientTimeout
}));

app.get('/signup', (req, res) => res.render('pages/signup', { 
	STRIPE_API_KEY: config.stripePublishablekey, 
	PWD_MIN_LENGTH: config.pwdMinLength, 
	CLIENT_TIMEOUT: config.clientTimeout 
}));

app.get('/forget-password', (req, res) => res.render('pages/forget-password'));

app.get('/reset-password', (req, res) => res.render('pages/reset-password'));

app.get('/email-confirmation', (req, res) => res.render('pages/email-confirmation'));

app.get('/dashboard1', (req, res) => {

	res.render('../public/app-assets/app.html');

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
app.get('/api/**', (req, res) => res.status(404).send({ message: '404 not found' }));

// app route
app.get('/dashboard', (req, res) => res.render('../public/app-assets/app.html'));
app.get('/dashboard/**', (req, res) => res.render('../public/app-assets/app.html'));
app.get('/induction', (req, res) => res.render('../public/app-assets/app.html'));
app.get('/induction/**', (req, res) => res.render('../public/app-assets/app.html'));

// generic route
app.get('/', (req, res) => res.render('pages/index'));
app.get('**', (req, res) => res.redirect('/'));

// handle error
app.use((err, req, res, next) => {
	//res.send({ data: err.message, throw: req.clientErr });
	err.statusMessage = req.ifErr;
	res.status(422).send({ error: err.message, data: err });
});

module.exports = app;