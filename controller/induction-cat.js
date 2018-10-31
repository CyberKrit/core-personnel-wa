const InductionCatModel = require('../model/induction-cat');

module.exports = {

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