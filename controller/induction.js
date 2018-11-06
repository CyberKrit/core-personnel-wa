const InductionModel = require('../model/induction');
const InductionCatModel  = require('../model/induction-cat');
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
					InductionCatModel.findByIdAndUpdate(
						buildInduction.category, 
						{ $push: {'inductions': { induction: newInduction._id }} },
						{ new: true }
					)
					.then(updatedCat => {
						res.statusMessage = UtilityFn.ripple(false, 'success', 'New induction was set');
						res.status(200).send({ _id: newInduction._id.toHexString() });
					})
					.catch(err => {
					  res.status(422).send(err);
					});

				} else {
					res.statusMessage = UtilityFn.ripple(true, 'success', 'Induction creation failed');
					res.status(500).send({ message: 'Induction creation failed' });
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});

	},

	list(req, res) {

		InductionModel.find({})
			.sort({ 'updatedAt': -1 })
			.then(inductionList => {
				let buildRes = [];

				if( inductionList.length ) {
					inductionList.map(({ _id, name, category, createdAt, updatedAt }) => {
						_id = _id.toHexString();
						
						buildRes.push({ _id, name, category, createdAt, updatedAt });
					});
				}

				res.statusMessage = UtilityFn.ripple(false, 'success', 'Inductions has loaded');
				res.status(200).send(buildRes);
			})
			.catch(err => {
			  res.status(422).send(err);
			});

	},

	singleView(req, res) {
		const inductionId = req.params.id;

		InductionModel.findById(inductionId)
			.then(induction => {
				if( induction ) {
					let { _id, name } = induction;
					let buildRes = {
						_id, name
					};

					res.statusMessage = UtilityFn.ripple(false, 'success', 'Induction view has loaded');
					res.status(200).send(buildRes);
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});

	}

};