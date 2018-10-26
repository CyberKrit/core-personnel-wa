const UserController = require('../controller/user');

module.exports = (app) => {

	app.post('/api/user', UserController.create);
	// avaibility
	app.get('/api/user/is-available/email/:email', UserController.isEmailAvailable);
	// login
	app.post('/api/user/login', UserController.login);

};