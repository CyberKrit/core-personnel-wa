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
					list.map(({ name, price, duration, currency, limit }) => {
						buildRes.push({ name, price, duration, currency, limit });
					});

					// response
					res.send({ status: true, resData: buildRes });
				} else {
					res.send({ status: false });
				}
			})
			.catch(next);
		
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