const InductionCatController = require('../controller/induction-cat');

module.exports = (app) => {

	app.get('/api/induction-cat', InductionCatController.list);
	app.post('/api/induction-cat', InductionCatController.create);
	app.put('/api/induction-cat', InductionCatController.update);
	app.delete('/api/induction-cat/:id', InductionCatController.delete);

};