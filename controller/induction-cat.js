const InductionCatModel = require('../model/induction-cat');
const UtilityFn = require('../utility');

module.exports = {

	// view inductions
	list(req, res) {
		InductionCatModel.find({})
			.sort({ 'updatedAt': -1 })
			.then(categories => {
				resp = [];
				if( categories.length ) {
					categories.map(({ _id, name, slug, inductions }) => {
						resp.push({ _id, name, slug, inductions: inductions.length });
					});
				}
				res.statusMessage = UtilityFn.ripple(false, 'success', 'Categories has loaded');
				res.status(200).send(resp);
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	},

	// create induction
	create(req, res) {
		InductionCatModel.create(req.body)
			.then(category => {
				if( category ) {
					res.statusMessage = UtilityFn.ripple(true, 'success', 'New category was set');
					res.status(200).send({ message: 'New category was set' });
				} else {
					res.status(500).send({ message: 'Category creation failed' });
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	},

	// delete induction
	delete(req, res) {
		const id = req.params.id;

		InductionCatModel.deleteOne({ _id: id })
			.then(item => {
				res.statusMessage = UtilityFn.ripple(true, 'success', 'Category was removed');
				res.status(204).send({ message: 'Category was removed' });
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	},

	// update induction
	update(req, res) {
		const { _id, name, slug } = req.body;

		InductionCatModel.findByIdAndUpdate1(_id, { _id, name, slug, updatedAt: new Date() }, { new: true })
			.then(updatedCat => {
				if( updatedCat ) {
					res.statusMessage = UtilityFn.ripple(true, 'success', 'Category was updated');
					res.status(200).send({ message: 'Category was updated' });
				} else {
					res.statusMessage = UtilityFn.ripple(true, 'error', 'Category update failed');
					res.status(500).send({ message: 'Category update failed' });
				}
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	},

	// brief induction
	brief(req, res) {
		InductionCatModel.find({})
			.sort({ 'updatedAt': -1 })
			.then(categories => {
				buildRes = [];
				if( categories.length ) {
					categories.map(({ _id, name }) => {
						buildRes.push({ _id, name });
					});
				}
				res.status(200).send(buildRes);
			})
			.catch(err => {
			  res.status(422).send(err);
			});
	}

};