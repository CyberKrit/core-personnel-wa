const InductionModel = require('../model/induction');
const InductionCatModel  = require('../model/induction-cat');
const UtilityFn = require('../utility');
const mongoose = require('mongoose');

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
					let slideCount = induction.slides.length;

					let buildRes = {
						_id, name, slideCount
					};

					res.status(200).send(buildRes);
				} else {
					res.status(500).send({ message: 'Induction edit data has failed to load' });
				}
			})
			.catch(next);
	},

	slide(req, res, next) {
		const inductionId = req.params.id;
		InductionModel.findByIdAndUpdate(inductionId, {$push: { 'slides': { status: 'draft' }} })
			.then(updatedInduction => {
				if( updatedInduction ) {
					res.send({ 
						status: true, 
						slideDeckId: updatedInduction._id , 
						slideIndex: updatedInduction.slides.length 
					});
				} else {
					next();
				}
			})
			.catch(next);

	},

	inductionSingleData(req, res, next) {
		const inductionId = req.params.id;
		let slideIndex = parseInt(req.params.index);

		InductionModel.findById(inductionId)
			.then(induction => {
				if( induction ) {
					res.send({
						_id: induction._id ,
						name: induction.name,
						slide: induction.slides[slideIndex],
						slideIndex
					});
				} else {
					next();
				}
			})
			.catch(next);

	},

	update(req, res, next) {
		let { inductionId, slideIndex } = req.body;
		let { template, name, variation, header, status } = req.body.slideData;

		// set document array index dynamically
		let updateQuery = {};
		updateQuery['slides.' + slideIndex] = {
			template: mongoose.Types.ObjectId(template),
			name, variation, header, status, updatedAt: new Date()
		};

		InductionModel.findByIdAndUpdate(inductionId, {
				updatedAt: new Date(),
				'$set': updateQuery
		 	}, { new: true })
			.then(updatedInduction => {
				if( updatedInduction ) {
					res.statusMessage = UtilityFn.ripple(true, 'success', 'Slide data has been updated');
					res.status(200).send({ message: 'Slide data has been updated'});
				} else {
					next();
				}
			})
			.catch(next);
	},

	// delete slide
	deleteSlide(req, res, next) {
		const inductionId = req.params.induction;
		const slideId = req.params.slide;

		InductionModel.findByIdAndUpdate(inductionId, {
				'$pull': {
					slides: [mongoose.Types.ObjectId(slideId)]
				}
			})
			.then(() => {
				res.statusMessage = UtilityFn.ripple(true, 'success', 'Slide has been deleted');
				res.status(200).send({ message: 'Slide has been updated'});
			})
			.catch(next);
	}

};