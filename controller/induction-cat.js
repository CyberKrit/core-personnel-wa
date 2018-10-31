const InductionCatModel = require('../model/induction-cat');

module.exports = {

	list(req, res) {
		InductionCatModel.find({})
			.sort({ 'updatedAt': -1 })
			.then(categories => {
				buildRes = [];
				if( categories.length ) {
					categories.map(({ _id, name, slug }) => {
						buildRes.push({ _id, name, slug });
					});
				}
				res.status(200).send(buildRes);
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	},

	create(req, res) {
		InductionCatModel.create(req.body)
			.then(category => {
				if( category ) {
					res.status(200).send({ status: true });
				} else {
					res.status(200).send({ status: false });
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	}

};