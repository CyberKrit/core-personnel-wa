const abandonedSubsontroller = require('../controller/abandoned-subscription');

module.exports = (app) => {
	// create
	app.post('/api/abandoned-subs', abandonedSubsontroller.create);

};