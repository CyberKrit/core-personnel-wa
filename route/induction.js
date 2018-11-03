const InductionCatController = require('../controller/induction');

module.exports = (app) => {

	// induction category
	// view inductions
	app.get('/api/induction-cat', InductionCatController.list);
	// for dropdown purpose only
	app.get('/api/induction-cat/brief', InductionCatController.brief);
	// create induction
	app.post('/api/induction-cat', InductionCatController.create);
	// update induction
	app.put('/api/induction-cat', InductionCatController.update);
	// delete induction
	app.delete('/api/induction-cat/:id', InductionCatController.delete);

};