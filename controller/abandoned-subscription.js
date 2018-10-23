const AbandonedSubsModel = require('../model/abandoned-subscription');

module.exports = {

	create(req, res, next) {
		let { company, email } = req.body;

		AbandonedSubsModel.findOne({ email })
			.then(client => {
				if( client === null ) {
					AbandonedSubsModel.create({ company, email })
						.then(newClient => {
							if( newClient ) {
								res.status(200).send({ clientId: newClient._id.toHexString() });
							} else {
								res.status(204).send({ clientId: null });
							}
						})
						.catch(next);
				} else {
					let { _id } = client;
					AbandonedSubsModel.findByIdAndUpdate(_id, { company, updatedAt: Date.now() })
						.then(updatedClient => {
							if( updatedClient ) {
								res.status(200).send({ clientId: updatedClient._id.toHexString() });
							} else {
								res.status(204).send({ clientId: null });
							}
						})
						.catch(next);
				}
			})
			.catch(err => {
				res.status(422).send(err);
			});
	} // end::create

};