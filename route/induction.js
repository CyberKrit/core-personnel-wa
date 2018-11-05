const InductionController = require('../controller/induction');

module.exports = (app) => {

	// induction category
	// create inductions
	app.post('/api/induction', InductionController.create);

};