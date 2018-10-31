const InductionCatController = require('../controller/induction-cat');

module.exports = (app) => {

	app.post('/api/induction-cat', InductionCatController.create);

};