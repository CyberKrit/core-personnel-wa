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
	emailConfirmationExp: 3, // in days
	fileUploadPath: 'https://evening-shelf-25137.herokuapp.com/uploads/',
	templateSlugs: [
		'section', 
		'text-only', 
		'image-only', 
		'image-with-caption', 
		'image-left-content-right', 
		'image-right-content-left', 
		'content-with-3-images', 
		'video', 
		'quiz'
	]
};