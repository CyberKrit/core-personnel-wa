const InductionModel = require('../model/induction');
const UtilityFn = require('../utility');

module.exports = {

	create(req, res) {
		let buildInduction = {
			name: req.body.inductionName,
			category: req.body.inductionCat
		};

		InductionModel.create(buildInduction)
			.then(newInduction => {
				if( newInduction ) {
					res.statusMessage = UtilityFn.ripple(false, 'success', 'New induction was set');
					res.status(200).send({ _id: newInduction._id.toHexString() });
				} else {
					res.statusMessage = UtilityFn.ripple(true, 'success', 'Induction creation failed');
					res.status(500).send({ message: 'Induction creation failed' });
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});

	}

};