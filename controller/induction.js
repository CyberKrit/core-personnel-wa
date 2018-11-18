const InductionModel = require('../model/induction');
const InductionCatModel  = require('../model/induction-cat');
const TemplateModel  = require('../model/template');
const MediaModel = require('../model/media');
const UtilityFn = require('../utility');
const mongoose = require('mongoose');
const moment = require('moment');

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
			.sort({ 'createdAt': -1 })
			.populate('category')
			.then(inductionList => {
				let buildRes = [];

				if( inductionList.length ) {
					inductionList.map(({ _id, name, category, createdAt, slides, views, completed }) => {
						_id = _id.toHexString();
						createdAt = moment(createdAt).format('LL');
						let slideCount = slides.length;
						category = category.name;
						
						buildRes.push({ _id, name, category, createdAt, slideCount, views, completed });
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

	// induction edit page resolve data
	editResolve(req, res, next) {
		
		const inductionId = req.params.id;

		InductionModel.findById(inductionId)
		.populate('slides.template')
			.then(induction => {
				if( induction ) {
					let { _id, name } = induction;

					let slides = [];
					induction.slides.map(({ _id, name, variation, status, updatedAt, template }) => {
						let lastUpdated = '';

						let startData = moment(updatedAt);
						let now = moment(new Date());
						let duration = moment.duration(now.diff(startData));

						let getSecond = duration.asSeconds();
						let getMinute = duration.asMinutes();
						let getHour = duration.asHours();
						let getDay = duration.asDays();
						let getWeek = duration.asWeeks();
						let getMonth = duration.asMonths();
						let getYear = duration.asYears();

						if( getYear >= 1 ) {
							lastUpdated = Math.trunc(getYear) + ' year ago';
						} else if ( getMonth >= 1 ) {
							lastUpdated = Math.trunc(getMonth) + ' month ago';
						} else if ( getWeek >= 1 ) {
							lastUpdated = Math.trunc(getWeek) + ' week ago';
						} else if ( getDay >= 1 ) {
							lastUpdated = Math.trunc(getDay) + ' day ago';
						} else if ( getHour >= 1 ) {
							lastUpdated = Math.trunc(getHour) + ' hour ago';
						} else if ( getMinute >= 1 ) {
							lastUpdated = Math.trunc(getMinute) + ' minute ago';
						} else {
							lastUpdated = Math.trunc(getSecond) + ' second ago';
						}

						// try-catch because some old data has no template property
						// to avoid error i've implemented this in dev environment
						try {
							slides.push({ 
								_id, name, variation, status, updatedAt: lastUpdated, 
								template: { name: template.name, _id: template._id.toHexString() }
							});
						} catch (err) {
							slides.push({ 
								_id, name, variation, status, updatedAt: lastUpdated
							});
						}
					});
					// reverse array so item can come by their created date
					slides = slides.reverse();

					let buildRes = {
						_id, name, slides
					};

					res.status(200).send(buildRes);
				} else {
					res.status(500).send({ message: 'Induction edit data has failed to load' });
				}
			})
			.catch(next);
	},

	// create a new slide with default data
	slide(req, res, next) {
		const inductionId = req.params.id;

		TemplateModel.find()
			.then(templates => {
				if( templates.length ) {
					let defaultTemplate;
					// loop through template to find default one
					templates.map(template => {
						if( template.byDefault ) {
							defaultTemplate = template;
						}
					});
					// if default not found make first template default
					defaultTemplate = templates[0];

					InductionModel.findByIdAndUpdate(inductionId, {
							$push: { 'slides': { 
								name: defaultTemplate.name,
								status: 'draft',
								template: mongoose.Types.ObjectId(defaultTemplate._id),
								resource: null
							}} 
						})
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

				} else {
					res.statusMessage = UtilityFn.rippleErr('No template has been found');
					res.status(422).send({ message: 'No template has been found' });
				}
			})
			.catch(next);


	},

	// get resolve data for single slide
	inductionSingleData(req, res, next) {
		const inductionId = req.params.id;
		let slideIndex = parseInt(req.params.index);

		TemplateModel.find()
			.then(templates => {
				if( typeof templates === 'object' && templates.length ) {
					let defaultTemplate;
					// loop through template to find default one
					templates.map(template => {
						if( template.byDefault ) {
							defaultTemplate = template;
						}
					});
					// if default not found make first template default
					defaultTemplate = templates[0];
					// get data
					InductionModel.findById(inductionId)
						.then(induction => {
							if(typeof induction.slides === 'object' && induction.slides[slideIndex]) {
								let hasResource;

								try {
									MediaModel.findById(induction.slides[slideIndex].resource[0].source)
										.then(media => {
											if( media ) {
												let { _id, src } = media;

												res.send({
													_id: induction._id ,
													name: induction.name,
													slide: induction.slides[slideIndex],
													slideIndex,
													defaultTemplate,
													media: { _id, src }
												});
											} else {
												next();
											}
										})
								} catch (err) {
										res.send({
											_id: induction._id ,
											name: induction.name,
											slide: induction.slides[slideIndex],
											slideIndex,
											defaultTemplate,
											media: null
										});
								}
							} else {// endif
								next();
							}
							
						})
						.catch(next);

				} else {
					res.statusMessage = UtilityFn.rippleErr('No template has been found');
					res.status(422).send({ message: 'No template has been found' });
				}
			})
			.catch(next);

	},

	// update slide
	update(req, res, next) {
		let { inductionId, slideIndex } = req.body;
		let { template, name, variation, header, status, resource } = req.body.slideData;

		try {
			let { type, source, caption, alt, desc, position, size } = resource;
		} catch (err) {
			let type, source, caption, alt, desc, position, size;
			type = source = caption = alt = desc = position = size = null;
		}

		// set document array index dynamically
		let updateQuery = {};
		if( resource ) {
			updateQuery['slides.' + slideIndex] = {
				template: mongoose.Types.ObjectId(template),
				name, variation, header, status, updatedAt: new Date(),
				resource
			};
		} else {
			updateQuery['slides.' + slideIndex] = {
				template: mongoose.Types.ObjectId(template),
				name, variation, header, status, updatedAt: new Date(), 
				resource: null
			};
		}

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
	

	// editor image-only
	editorImageOnly(req, res, next) {
		res.send({ status: true });
	},


	// *** [[ slide ]] *** //

	deleteSlide(req, res, next) {
		const inductionId = req.params.induction;
		const slideId = req.params.slide;

		InductionModel.findByIdAndUpdate(inductionId, {
				'$pull': {
					slides: { _id: mongoose.Types.ObjectId(slideId) }
				}
			})
			.then(data => {
				res.statusMessage = UtilityFn.ripple(true, 'success', 'Slide has been deleted');
				res.status(200).send({ message: 'Slide has been updated'});
			})
			.catch(next);
	},

	cloneSlide(req, res, next) {
		const inductionId = req.params.induction;
		const slideId = req.params.slide;

		InductionModel.findById(inductionId)
			.lean()
			.then(induction => {
				if( induction && induction.slides.length ) {

					// get index of the target slide
					let getSlideIndex = induction.slides.findIndex(slide => slide._id.toString() === slideId );
					// clone and assign into a variable
					let slideData = JSON.parse(JSON.stringify(induction.slides[getSlideIndex]));
					InductionModel.findByIdAndUpdate(inductionId, {
						$push: {
							slides: { 
								name: slideData.name,
								status: slideData.status,
								template: mongoose.Types.ObjectId(slideData.template),
								header: slideData.header,
								resource: slideData.resource
							}
						}
					}, { new: true })
					.then(updatedInduction => {
						if( updatedInduction ) {
							res.status(200).send({ message: 'New slide has created'});
						} else {
							res.statusMessage = UtilityFn.rippleErr('New slide creating has failed');
							res.status(501).send({ message: 'New slide creating has failed'});
						}
					})
					.catch(next);
				} else {
					res.statusMessage = UtilityFn.rippleErr('Induction details is not correct');
					res.status(403).send({ message: 'Induction details is not correct'});
				}
			})
			.catch(next);
	},

	sortSlide(req, res, next) {
		const previousIndex = req.params.previousIndex;
		const currentIndex = req.params.currentIndex;
		const inductionId = req.params.inductionId;

		InductionModel.findById(inductionId)
			.then(induction => {
				let getInduction = JSON.parse(JSON.stringify(induction));

				let pulledSlide = getInduction.slides[previousIndex];
				getInduction.slides[previousIndex] = getInduction.slides[currentIndex];
				getInduction.slides[currentIndex] = pulledSlide;

				InductionModel.findByIdAndUpdate(inductionId, getInduction)
					.then(updatedInduction => {
						res.status(200).send({ message: 'Sorting has been saved' });
					})
					.catch(next);
			})
			.catch(next);
	}

};