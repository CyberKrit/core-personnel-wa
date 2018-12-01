module.exports = {
	stripePublishablekey: 'pk_test_Okgc1K7VMvnqESGK5uMdmMCf',
	stripeSecretkey: 'sk_test_lb1GulUKDqKnjtLVcnrIzOPw',
	mongodbURL: 'mongodb://samratdey:yellowmonk87@ds231133.mlab.com:31133/generic',
	trialOnSignup: true,
	trialDuration: 14,
	pwdMinLength: 8,
	jwtSecret: '!YeSlmW_MoadNrkt7198@87',
	clientTimeout: 12000,
	// email
	emailConfirmationExp: 3, // in days
	fileUploadPath: 'http://localhost:3000/uploads/',
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