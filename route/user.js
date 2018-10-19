const UserController = require('../controller/user');

module.exports = (app) => {

	app.post('/api/user', UserController.create);

};