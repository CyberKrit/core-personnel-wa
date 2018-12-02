const UserController = require('../controller/user');
const { failMsg } = require('../middleware/failMsg');
const { auth } = require('../middleware/auth');

module.exports = (app) => {
	// profile resolve
	app.get('/api/login', failMsg('Login page has failed to load'), UserController.userLoginPage);

	app.post('/api/user', UserController.create);
	// avaibility
	app.get('/api/user/is-available/email/:email', UserController.isEmailAvailable);
	// login
	app.post('/api/user/login', UserController.login);
	// login
	app.post('/api/user/isAuth', UserController.isAuth);

	// profile resolve
	app.get('/api/user/profile', auth, failMsg('User data has failed to load'), UserController.profileReolve);

};