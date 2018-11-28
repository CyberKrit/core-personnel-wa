const InductionController = require('../controller/induction');
const { failMsg } = require('../middleware/failMsg');
const { auth } = require('../middleware/auth');

module.exports = (app) => {

	// *** [[ induction ]] *** //

	app.get('/api/induction', auth, failMsg('Inductions are unable to load'), InductionController.list);
	app.post('/api/induction', auth, failMsg('Induction creation failed'), InductionController.create);
	app.put('/api/induction', auth, failMsg('Slide creation failed'), InductionController.update);


	// view an induction
	app.get('/api/induction/:id', InductionController.singleView);



	// *** [[ EDITOR ]] *** //

	// resolve
	app.get('/api/editor', auth, failMsg('Template has failed to load'), InductionController.editorResolve);
	app.post('/api/editor/section', auth, failMsg('Template has failed to act accordingly'), InductionController.editorSection);
	app.post('/api/editor/textOnly', auth, failMsg('Template has failed to act accordingly'), InductionController.editorTextOnly);
	app.post('/api/editor/imageOnly', auth, failMsg('Template has failed to act accordingly'), InductionController.editorImageOnly);
	app.post('/api/editor/imageCaption', auth, failMsg('Template has failed to act accordingly'), InductionController.editorImageCaption);
	app.post('/api/editor/imageLContentR', auth, failMsg('Template has failed to act accordingly'), InductionController.editorImageLContentR);
	app.post('/api/editor/quiz', auth, failMsg('Template has failed to act accordingly'), InductionController.editorQuiz);



	// *** [[ slide ]] *** //

	// // delete a slide
	app.delete('/api/induction/slide/:induction/:slide', auth, failMsg('Slide deletion failed'), InductionController.deleteSlide);
	// // clone a slide
	app.get('/api/induction/slide/clone/:induction/:slide', auth, failMsg('Slide cloning failed'), InductionController.cloneSlide);
	// // rearrange slide based on drag-drop
	app.post('/api/induction/slide/reorder', auth, failMsg('Sorting failed to save'), InductionController.sortSlide);


	// *** [[ resolve ]] *** //

	// edit resolve data
	app.get('/api/induction/edit/:id', auth, failMsg('Induction edit data has failed to load'), InductionController.editResolve);


};