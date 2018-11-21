const TemplateController = require('../controller/template');
const { failMsg } = require('../middleware/failMsg');

module.exports = (app) => {
	// resolve
	app.get('/api/template', failMsg('Template data has failed to load'), TemplateController.list);
	app.post('/api/template', failMsg('Template data has failed to load'), TemplateController.create);
	app.get('/api/template/resolve/:inductionId', failMsg('Template data has failed to load'), TemplateController.templateResolve);

};