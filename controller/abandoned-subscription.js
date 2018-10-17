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
								res.send({ status: true, clientId: newClient._id.toString() });
							} else {
								res.send({ status: false });
							}
						})
						.catch(next);
				} else {
					let { _id } = client;
					AbandonedSubsModel.findByIdAndUpdate(_id, { company, updatedAt: Date.now() })
						.then(updatedClient => {
							if( updatedClient ) {
								res.send({ status: true, clientId: updatedClient._id.toString() });
							} else {
								res.send({ status: false });
							}
						})
						.catch(next);
				}
			})
			.catch(next);
	} // end::create

};