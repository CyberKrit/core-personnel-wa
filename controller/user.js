const UserModel = require('../model/user');
const config = require('../config/config');
const stripe = require('stripe')(config.stripeSecretkey);

const nodemailer = require('nodemailer');
const _ = require('underscore');
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};
const fs = require('fs');

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
					email,
					password: pwd,
					company: [{ name: company }],
					subscription: [{ id: subscription, status: trialOnSignup }],
					status: [{ active: 'no' }],
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
						return newsUser.generateEmailToken();
					})
					.then( ({ token }) => {

						const smtpTransport = nodemailer.createTransport({
					    host: 'smtp.gmail.com',
					    port: 465,
					    secure: true,
					    auth: {
					        type: 'OAuth2',
					        clientId: '690998438847-01s79q1daise7flph2mupj584cqon37g.apps.googleusercontent.com',
					        clientSecret: 'oKe1qSCxtJwoCcvbcCjjIZtk'
					    }
						});

						const mailOptions = {
					    from: 'Samrat Dey <mail.samrat.dey@gmail.com>',
					    to: 'tanmoy.binarywrap@gmail.com',
					    subject: '[ACTION NEEDED] Confirm your email address',
					    html: getEmailTemplate(),
					    auth: {
					      user: 'mail.samrat.dey@gmail.com',
					      refreshToken: '1/zhoMRvwQDUmtrVaJQWOeZQ_oF2_jlXY3bd_G227SU758w90YEDLJ6hJ3hb495rxi',
					      accessToken: 'ya29.Gls_BpxN8QywqMZzwH6V70CPvRcnjxRxDYukcc7Yl-N3ypcMnDD3jE7dA6uj030wJCOW4eDtbokrg8XkvgVcQKp6rgQslqiEFTKMzDxtwN2sqGjJzrV212W6juu-'
					    }
						};

						smtpTransport.sendMail(mailOptions, (err, res) => {
							console.log('=========================================================');
							err ? console.log(err) : console.log(res);
							console.log('=========================================================');
					    smtpTransport.close();
						});

						res.header('x-auth', token).send({ message: 'User is set. Email verifiction is pending.' });
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

const model = {
	verify: 'http://samratdey.com/',
	body: 'Thanks for joining the Core Personnel WA. Just to ensure that you\'re a real person and that you wanted our FREE 14 days Trial Subscription, We need you to confirm your email address.'
};

function getEmailTemplate() {

	const path = './views/email-template/confirmation-bck.html';
	let emailTemplate = fs.readFileSync(path, encoding = 'utf8');

	let emailTemplateAltered = _.template(emailTemplate);

	return emailTemplateAltered(model);

}