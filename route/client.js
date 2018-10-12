const ClientController = require('../controller/client');

module.exports = (app) => {

	app.get('/api', ClientController.userPJPCreate);

};