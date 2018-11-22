const InductionController = require('../controller/induction');
const { failMsg } = require('../middleware/failMsg');

module.exports = (app) => {

	// *** [[ induction ]] *** //

	app.get('/api/induction', failMsg('Inductions are unable to load'), InductionController.list);
	app.post('/api/induction', failMsg('Induction creation failed'), InductionController.create);
	app.put('/api/induction', failMsg('Slide creation failed'), InductionController.update);


	// view an induction
	app.get('/api/induction/:id', InductionController.singleView);



	// *** [[ EDITOR ]] *** //

	// resolve
	app.get('/api/editor', failMsg('Template has failed to load'), InductionController.editorResolve);
	app.post('/api/editor/section', failMsg('Template has failed to act accordingly'), InductionController.editorSection);



	// *** [[ slide ]] *** //

	// create a slide
	// app.get('/api/induction/slide/create/:id', failMsg('Slide creation failed'), InductionController.slide);
	// // delete a slide
	app.delete('/api/induction/slide/:induction/:slide', failMsg('Slide deletion failed'), InductionController.deleteSlide);
	// // clone a slide
	app.get('/api/induction/slide/clone/:induction/:slide', failMsg('Slide cloning failed'), InductionController.cloneSlide);
	// // rearrange slide based on drag-drop
	app.post('/api/induction/slide/reorder', failMsg('Sorting failed to save'), InductionController.sortSlide);


	// *** [[ resolve ]] *** //

	// edit resolve data
	app.get('/api/induction/edit/:id', failMsg('Induction edit data has failed to load'), InductionController.editResolve);
	// induction-single page resolve
	// app.get('/api/induction/singleResolveData/:id/:index', failMsg('Induction data failed to load'), InductionController.inductionSingleData);


};