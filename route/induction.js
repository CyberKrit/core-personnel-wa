const InductionController = require('../controller/induction');
const { failMsg } = require('../middleware/failMsg');

module.exports = (app) => {

	// induction category
	// create inductions
	app.get('/api/induction', failMsg('Inductions are unable to load'), InductionController.list);
	app.post('/api/induction', failMsg('Induction creation failed'), InductionController.create);
	app.get('/api/induction/:id', InductionController.singleView);

	// edit resolve data
	app.get('/api/induction/edit/:id', failMsg('Induction edit data has failed to load'), InductionController.editResolve);

	// create a slide
	app.get('/api/induction/slide/create/:id', failMsg('Slide creation failed'), InductionController.slide);

	// get induction absic details as a resolve for induction-single page
	app.get('/api/induction/singleResolveData/:id/:index', failMsg('Induction data failed to load'), InductionController.inductionSingleData);

};