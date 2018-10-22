const SubscriptionModel = require('../model/subscription');

module.exports = {

	create(req, res, next) {
		SubscriptionModel.create(req.body)
			.then(newSub => {
				if( newSub ) {
					res.send({ status: true });
				} else {
					res.send({ status: false });
				}
			})
			.catch(next);
		
	}, // end::create

	list(req, res, next) {
		SubscriptionModel.find()
			.sort({ createdAt: 1 })
			.then(list => {
				if( list.length ) {

					// filter info
					let buildRes = [];
					list.map(({ _id, name, price, duration, currency, limit }) => {
						buildRes.push({ _id, name, price, duration, currency, limit });
					});

					// response
					res.status(200).send({ res: buildRes });
				} else {
					res.status(204).send({ message: 'no subscription entry has been found' });
				}
			})
			.catch(err => {
				res.status(422).send(err);
			});
		
	}, // end::list

	update(req, res, next) {

		let _id = req.params.id;
		const updateData = req.body;
		updateData['updatedAt'] = Date.now();

		SubscriptionModel.findByIdAndUpdate(_id, updateData, {new: true})
			.then(updatedSub => {
				if( updatedSub ) {
					res.send({ status: true });
				} else {
					res.send({ status: false });
				}
			})
			.catch(next);

	}

};