const UserModel = require('../model/user');
const config = require('../config/config');
const stripe = require('stripe')(config.stripeSecretkey);

module.exports = {

	create(req, res, next) {
		let { company, email, pwd, stripeToken, subscriptionId } = req.body;

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
					subscription: [{ id: subscriptionId, status: 'trial' }],
					status: [{ active: true }],
					userType: 'client',
					stripe: [{ 
						customerId: source.customer,
						cardId: source.id,
						cardNumber: source.last4,
						brand: source.brand,
						expMonth: source.exp_month,
						expYear: source.exp_year,
						funding: source.funding
					}]
				};
				UserModel.create(buildInput)
					.then(newsUser => {
						res.send({ status: true, data: newsUser._id });
					})
					.catch(err => {
					  res.status(422).send({ error: err });
					});
				//console.log(source);
			})
			.catch(err => {
			  res.status(422).send({ error: err.message });
			});
		}
		//res.send({ send: true });
	}

};