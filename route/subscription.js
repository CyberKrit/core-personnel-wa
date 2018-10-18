const SubscriptionCtrl = require('../controller/subscription');
module.exports = (app) => {

	// create
	app.post('/api/subscription', SubscriptionCtrl.create);
	// list
	app.get('/api/subscription', SubscriptionCtrl.list);
	// update
	app.put('/api/subscription/:id', SubscriptionCtrl.update);

};