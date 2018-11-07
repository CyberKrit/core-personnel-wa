const InductionCatController = require('../controller/induction-cat');
const { failMsg } = require('../middleware/failMsg');

module.exports = (app) => {

	// induction category
	// view inductions
	app.get('/api/induction-cat', failMsg('Categories are unable to load'), InductionCatController.list);
	// for dropdown purpose only
	app.get('/api/induction-cat/brief', failMsg('Categories are unable to load'), InductionCatController.brief);
	// create induction
	app.post('/api/induction-cat', failMsg('Category creation failed'), InductionCatController.create);
	// update induction
	app.put('/api/induction-cat', failMsg('Category update failed'), InductionCatController.update);
	// delete induction
	app.delete('/api/induction-cat/:id', failMsg('Category removal failed'), InductionCatController.delete);

};