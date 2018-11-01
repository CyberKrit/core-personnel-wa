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
	},

	delete(req, res) {
		const id = req.params.id;

		InductionCatModel.deleteOne({ _id: id })
			.then(item => {
				res.status(200).send({ status: true });
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	},

	update(req, res) {console.log(req.body);
		const { _id, name } = req.body;

		InductionCatModel.findByIdAndUpdate(_id, { _id, name, updatedAt: new Date() }, { new: true })
			.then(updatedCat => {
				if( updatedCat ) {
					res.status(200).send({ message: 'category name has been updated' });
				} else {
					res.status(204).send({ message: 'something went wrong' });
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	}

};