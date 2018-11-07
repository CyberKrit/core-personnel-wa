const InductionController = require('../controller/induction');

module.exports = (app) => {

	// induction category
	// create inductions
	app.get('/api/induction', InductionController.list);
	app.post('/api/induction', InductionController.create);
	app.get('/api/induction/:id', InductionController.singleView);

	// edit resolve data
	app.get('/api/induction/edit/:id', InductionController.editResolve);

};