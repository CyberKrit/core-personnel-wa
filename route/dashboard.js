const DashboardController = require('../controller/dashboard');
const { auth } = require('../middleware/auth');

module.exports = (app) => {

	app.get('/api/dashboard', auth, DashboardController.load);

};