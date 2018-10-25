module.exports = {
	stripePublishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
	stripeSecretkey: process.env.STRIPE_SECRET_KEY,
	mongodbURL: process.env.MONGODB_URL,
	trialOnSignup: true,
	trialDuration: 14,
	pwdMinLength: 8,
	jwtSecret: process.env.JWT_SECRET_KEY,
	clientTimeout: 12000,
	// email
	emailConfirmationExp: 3 // in days
};