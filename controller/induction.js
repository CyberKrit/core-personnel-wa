const InductionModel = require('../model/induction');
const InductionCatModel  = require('../model/induction-cat');
const UtilityFn = require('../utility');

module.exports = {

	create(req, res, next) {

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
						res.status(200).send({ _id: newInduction._id.toHexString() });
					})
					.catch(next);

				} else {
					next();
				}
			})
			.catch(next);

	},

	list(req, res, next) {

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

				res.status(200).send(buildRes);
			})
			.catch(next);

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

					res.status(200).send(buildRes);
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});

	},

	editResolve(req, res, next) {
		
		const inductionId = req.params.id;

		InductionModel.findById(inductionId)
			.then(induction => {
				if( induction ) {

					let { _id, name } = induction;
					let buildRes = {
						_id, name
					};

					res.status(200).send(buildRes);
				} else {
					res.status(500).send({ message: 'Induction edit data has failed to load' });
				}
			})
			.catch(next);
	}

};