const UserModel = require('../model/user');
const config = require('../config/config');
const stripe = require('stripe')(config.stripeSecretkey);

module.exports = {

	create(req, res, next) {
		let { company, email, pwd, subscription, stripeToken, abandonedSub } = req.body;
		let trialOnSignup = config.trialOnSignup ? 'trial' : 'unset';

		// create stripe user
		if( stripeToken ) {
			stripe.customers.create({
			  email: email
			})
			.then(customer => {
			  return stripe.customers.createSource(customer.id, {
			    source: stripeToken
			  });
			})
			.then(source => {
				let buildInput = {
					credentials: [{ email, password: pwd }],
					company: [{ name: company }],
					subscription: [{ id: subscription, status: trialOnSignup }],
					status: [{ active: true }],
					userType: 'client',
					paymentMethod: 'stripe',
					stripe: [{ 
						customerId: source.customer,
						cardId: source.id,
						cardNumber: source.last4,
						brand: source.brand,
						expMonth: source.exp_month,
						expYear: source.exp_year,
						funding: source.funding
					}],
					roleManagement: [{ permission: 'all' }]
				};
				UserModel.create(buildInput)
					.then(newsUser => {
						return newsUser.generateAuthToken();
					})
					.then(data => {console.log(data.token);
						res.header('x-auth', data.token).send({ data: data.user });
					})
					.catch(err => {
					  res.status(422).send(err);
					});
				//console.log(source);
			})
			.catch(err => {
			  res.status(422).send(err);
			});
		}

	}

};