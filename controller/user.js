const UserModel = require('../model/user');
const config = require('../config/config');
const stripe = require('stripe')(config.stripeSecretkey);
const nodemailer = require('nodemailer');
const MediaModel = require('../model/media');
const fs = require('fs');
const UtilityFn = require('../utility');

const _ = require('underscore');
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

function getEmailTemplate(token, req) {

	// server base path
	let baseURL = req.protocol + '://' + req.get('host');
	// create email confirmation link
	let tokenURL = baseURL + '/verify-email?token=' + token;
	// email template path
	const templatePath = './views/email-template/confirmation.min.html';
	// logo url
	const logoURL = baseURL + '/web-assets/app-logo.png';
	// create model
	let model = { tokenURL, logoURL };

	let emailTemplate = fs.readFileSync(templatePath, encoding = 'utf8');
	let emailTemplateAltered = _.template(emailTemplate);
	return emailTemplateAltered(model);

}

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
					    to: email,
					    subject: '[ACTION NEEDED] Confirm your email address',
					    html: getEmailTemplate(token, req),
					    auth: {
					      user: 'mail.samrat.dey@gmail.com',
					      refreshToken: '1/zhoMRvwQDUmtrVaJQWOeZQ_oF2_jlXY3bd_G227SU758w90YEDLJ6hJ3hb495rxi',
					      accessToken: 'ya29.Gls_BpxN8QywqMZzwH6V70CPvRcnjxRxDYukcc7Yl-N3ypcMnDD3jE7dA6uj030wJCOW4eDtbokrg8XkvgVcQKp6rgQslqiEFTKMzDxtwN2sqGjJzrV212W6juu-'
					    }
						};

						smtpTransport.sendMail(mailOptions, (err, res) => {
							err ? console.log(err) : console.log(res);
					    smtpTransport.close();
						});

						res.header('x-auth', token).send({ message: 'User is set. Email verifiction is pending.' });
					})
					.catch(err => {
					  res.status(422).send(err);
					});
				
			})
			.catch(err => {
			  res.status(422).send(err);
			});
		}

	},

	isEmailAvailable(req, res) {
		const email = req.params.email;

		UserModel.findOne({ email })
			.then(user => {
				if( user ) {
					res.status(200).send({ isAvailable: false });
				} else {
					res.status(200).send({ isAvailable: true });
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});

	},

	login(req, res) {
		let { email, pwd } = req.body;

		UserModel.findByCredentials(email, pwd)
			.then(user => {
				if( user ) {
					return user.generateAuthToken();
				} else {
					res.status(403).send(err);
				}
			})
			.then(({ token }) => {
				res.header('x-auth', token).send({ message: 'User has successfully authenticated' });
			})
			.catch(err => {
			  res.status(403).send(err);
			});
			
	},// login

	isAuth(req, res, next) {
		
	},

	userLoginPage(req, res, next) {
		UserModel.findByToken(req.header('x-auth'))
			.then(user => {
				if( user ) {
					res.status(200).send({ status: true, message: 'Valid token' });
				} else {
					res.status(401).send({ status: false, message: 'Invalid token' });
				}
			})
			.catch(next);
	},

	profileReolve(req, res, next) {
		UserModel.findByToken(req.header('x-auth'))
			.then(user => {
				if( user ) {
					res.status(200).send({ data: user, message: 'user data has been loaded' });
				} else {
					res.statusMessage = UtilityFn.rippleErr('User not found');
					res.status(401).send({ message: 'User not found' });
				}
			})
			.catch(next);

	},

	updateUser(req, res, next) {
		let oldPwd = req.body.currentPwd;
		console.log(req.header('x-auth'));
		if( oldPwd ) {
			UserModel.findByToken(req.header('x-auth'))
				.then(user => {
					UserModel.validatePwd(user._id, req.body.currentPwd)
						.then(verifiedUser => {
							if( verifiedUser ) {

								// save user along with password
								UserModel.findByIdAndUpdate(verifiedUser._id, {
									$set: {
										email: req.body.email,
										company: [{
											name: req.body.companyName
										}],
										personal: [{
											firstname: req.body.firstName,
											lastname: req.body.lastName
										}],
										updatedAt: new Date()
									}
								}, { new: true })
								.then(updatedUser => {
									if( updatedUser ) {
										// encrypt then update password
										updatedUser.password = req.body.newPwd;
										updatedUser.save()
											.then(pwdRestUser => {
												if( pwdRestUser ) {
													// build user response
													let buildRes = {
														email: pwdRestUser.email,
														personal: [{
															firstname: pwdRestUser.personal[0].firstname,
															lastname: pwdRestUser.personal[0].lastname
														}],
														company: [{
															name: pwdRestUser.company[0].name
														}]
													};
													res.statusMessage = UtilityFn.ripple(true, 'success', 'User has been updated');
													res.status(200).send({ status: true, message: 'User has been successfully updated', data: buildRes });
												} else {
													res.statusMessage = UtilityFn.rippleErr('Password update has failed');
													res.status(422).send({ message: 'Password update has failed' });
												}
											})
											.catch(next);

									} else {
										res.statusMessage = UtilityFn.rippleErr('User data has failed to save');
										res.status(401).send({ message: 'User data has failed to save' });
									}
								})
								.catch(next);

							} else {
								res.send({ status: false, message: 'password doesn\'t match' });
							}
							
						})
						.catch(err => {
							res.send({ status: false, message: 'password doesn\'t match' });
						});
				})
				.catch(next);
		} else {
			UserModel.findByToken(req.header('x-auth'))
				.then(user => {
					if( user ) {
						UserModel.findByIdAndUpdate(user._id, {
							$set: {
								email: req.body.email,
								company: [{
									name: req.body.companyName
								}],
								personal: [{
									firstname: req.body.firstName,
									lastname: req.body.lastName
								}],
								updatedAt: new Date()
							}
						}, { new: true })
						.then(updatedUser => {
							if( updatedUser ) {
								// build user response
								let buildRes = {
									email: updatedUser.email,
									personal: [{
										firstname: updatedUser.personal[0].firstname,
										lastname: updatedUser.personal[0].lastname
									}],
									company: [{
										name: updatedUser.company[0].name
									}]
								};

								res.statusMessage = UtilityFn.ripple(true, 'success', 'User has been updated');
								res.status(200).send({ status: true, message: 'User has been successfully updated', data: buildRes });
							} else {
								res.statusMessage = UtilityFn.rippleErr('User data has failed to save');
								res.status(401).send({ message: 'User data has failed to save' });
							}
						})
						.catch(next);

					} else {
						res.statusMessage = UtilityFn.rippleErr('User Anauthenticated');
						res.status(401).send({ message: 'User Anauthenticated' });
					}
				})
				.catch(next);
			
		}
	}

};