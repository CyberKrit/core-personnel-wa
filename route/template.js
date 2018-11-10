const TemplateController = require('../controller/template');
const { failMsg } = require('../middleware/failMsg');

module.exports = (app) => {

	app.post('/api/template', failMsg('Template creation failed'), TemplateController.create);
	app.get('/api/template', failMsg('Templates are unable to load '), TemplateController.list);

};