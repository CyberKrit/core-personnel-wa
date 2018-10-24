const NonApiController = require('../controller/non-api');

module.exports = (app) => {

	app.get('/verify-email', NonApiController.verifyEmail);

};