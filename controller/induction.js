const InductionModel = require('../model/induction');
const InductionCatModel  = require('../model/induction-cat');
const TemplateModel  = require('../model/template');
const SlideModel  = require('../model/slide');
const MediaModel = require('../model/media');
const UtilityFn = require('../utility');
const mongoose = require('mongoose');
const moment = require('moment');

module.exports = {

	create(req, res, next) {

		let buildInduction = {
			user: req.user._id,
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

		InductionModel.find({ user: req.user._id })
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

	singleView(req, res, next) {
		const inductionId = req.params.id;
		let templateArr = [];

		TemplateModel.find()
			.then(templates => {
				if( Array.isArray(templates) ) {
					if( templates.length ) {
						// cache template slug-n-_id into array
						templates.map(({ _id, slug }) => {
							templateArr.push({ _id, slug });
						});

						InductionModel.findById(inductionId)
							.populate({
								path: 'slides.slide',
								populate: {
									path: 'resource.source'
								}
							})
							.then(induction => {
								if( induction ) {
									let { _id, name, slides } = induction;
									let buildRes = {
										_id, name, slides
									};
									
									if( slides.length > 1 ) {
										slides.sort((first, second) => {
											return placeholder = (first.order < second.order) ? false : true;
										});
									}

									slides.map(({ slide }, index) => {
										let getTemplate = templateArr.findIndex(item => item._id.toString() === slide.template.toString());
										if( getTemplate >= 0 ) {
											slide.template = templates[getTemplate];
										}
									});

									res.status(200).send(buildRes);
								}
							})
							.catch(next);

					}
				}
			})
			.catch(next);

	},

	// induction edit page resolve data
	editResolve(req, res, next) {
		const inductionId = req.params.id;

		TemplateModel.findOne({ slug: 'quiz' })
			.then(quizTemplate => {

				if( !quizTemplate ) {
					res.status(422).send({ message: 'quiz template is not found' });
					return;
				}

				// het induction details
				InductionModel.findById(inductionId)
					//.populate('slides.slide')
					.populate({
						path: 'slides.slide',
						// populate: {
						// 	path: 'template'
						// }
					})
					.then(induction => {
						if( induction ) {
							let { _id, name } = induction;

							let slides = [];
							if( induction.slides.length > 1 ) {
								induction.slides.sort((first, second) => {
									return placeholder = (first.order > second.order) ? false : true;
								});
							}

							induction.slides.map(slide => {
								let { _id, name, status, updatedAt, thumbnail, template } = slide.slide;
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
										_id, name, status, thumbnail, updatedAt: lastUpdated, 
										template: { name: template.name, _id: template._id.toHexString() }
									});
								} catch (err) {
									slides.push({
										_id, name, status, thumbnail, updatedAt: lastUpdated
									});
								}
							});

							let buildRes = {
								_id, name, slides, quizTemplateId: quizTemplate._id
							};

							res.status(200).send(buildRes);
						} else {
							res.status(500).send({ message: 'Induction edit data has failed to load' });
						}
					})
					.catch(next);

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
	inductionSingleData(req, res, next) {res.send({ send: true }); return;
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

		SlideModel.findByIdAndRemove(req.params.slide)
			.then(slide => {
				InductionModel.findByIdAndUpdate(inductionId, {
					'$pull': {
						slides: { slide: mongoose.Types.ObjectId(slideId) }
					}
				})
				.then(data => {
					res.statusMessage = UtilityFn.ripple(true, 'success', 'Slide has been deleted');
					res.status(200).send({ message: 'Slide has been updated'});
				})
				.catch(next);
			})
			.catch(next);
	},

	cloneSlide(req, res, next) {
		const inductionId = req.params.induction;
		const slideId = req.params.slide;

		SlideModel.findById(slideId)
			.lean()
			.then(slide => {
				delete slide._id;
				delete slide.createdAt;
				delete slide.updatedAt;

				SlideModel.create(slide)
					.then((newSlide) => {
						if( newSlide ) {
							InductionModel.findById(inductionId)
								.then(induction => {
									let slides = ++induction.slideCount;

									// save slide ref in induction array
									InductionModel.findByIdAndUpdate(inductionId, {
										$inc: { slideCount: 1 },
										$push: {
											slides: {
												slide: mongoose.Types.ObjectId(newSlide._id),
												order: slides
											}
										}
									}, { new: true })
									.then(induction => {
										res.statusMessage = UtilityFn.rippleSuccessShow('Slide has cloned successfully');
										res.status(200).send({ status: true, message: 'Slide has cloned successfully' });
									})
									.catch(next);

								})
								.catch(next);

						} else {
							res.statusMessage = UtilityFn.rippleErr('New slide creating has failed');
							res.status(501).send({ message: 'New slide creating has failed'});
						}
					})
					.catch(next);
			})
			.catch(next);
	},

	sortSlide(req, res, next) {
		let { inductionId, slideId, from, to } = req.body;

		InductionModel.findById(inductionId)
			.populate('slides.slide')
			.then(induction => {
				if( Array.isArray(induction.slides) ) {
					let slideArr = induction.slides;
					let slideCount = slideArr.length;
					// how many placed does targeted slide has been moved
					let shifted = Math.abs(from - to);
					// sort array
					slideArr.sort((first, second) => {
						return placeholder = (first.order > second.order) ? false : true;
					});

					if( Math.sign(from - to) === 1 ) { 
						// equal to drop item position
						slideArr[from].order = slideArr[to].order;

						// negative means downward
						for( let i = (from - 1); i >= to; i-- ) {
							slideArr[i].order -= 1;
						}

						// sort again in DSC
						slideArr.sort((first, second) => {
							return placeholder = (first.order > second.order) ? false : true;
						});

					} else {
						// equal to drop item position
						slideArr[from].order = slideArr[to].order;

						// negative means downward
						for( let i = (from + 1); i <= to; i++ ) {
							slideArr[i].order += 1;
						}

						// sort again in DSC
						slideArr.sort((first, second) => {
							return placeholder = (first.order > second.order) ? false : true;
						});

					} // endif

					induction.save()
						.then(updatedInduction => {
							res.status(200).send({ status: true, message: 'Sorting between slides has been done' });
						})
						.catch(next);

				}
			})
			.catch(next);
	},
	

	/* ==[ EDITOR ]== */

	editorResolve(req, res, next) {
		const { ind, tmp, slide, action } = req.query;
		let templateData, inductionData, slideData;
		templateData = inductionData = slideData = null;

		if( mongoose.Types.ObjectId.isValid(tmp) ) {
			templateData = TemplateModel.findById(tmp);
		}
		if( mongoose.Types.ObjectId.isValid(ind) ) {
			inductionData = InductionModel.findById(ind);
		}
		if( mongoose.Types.ObjectId.isValid(slide) ) {
			slideData = SlideModel.findById(slide).populate('resource.source');
		}

		Promise.all([templateData, inductionData, slideData])
			.then(data => {
				res.send({ action, template: data[0], induction: data[1], slide: data[2] });
			})
			.catch(next);

	},
	
	// section
	editorSection(req, res, next) {
		let { template, name, status, header, thumbnail } = req.body;

		let buildSlide = {
			template,
			name,
			status,
			header,
			thumbnail
		};

		if( req.query.slideId ) {

			buildSlide['updatedAt'] = new Date();
			SlideModel.findByIdAndUpdate(req.query.slideId, {
					$set: buildSlide
				}, { new: true})
				.then(updatedSlide => {
					if( updatedSlide ) {
						res.statusMessage = UtilityFn.rippleSuccessShow('Slide has been updated');
						res.status(200).send({ status: true, message: 'Slide has been updated' });
					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to update');
						res.status(501).send({ message: 'Slide has failed to update'});
					}
				})
				.catch(next);

		} else {

			SlideModel.create(buildSlide)
				.then(slide => {
					if( slide ) {
						InductionModel.findById(req.query.inductionId)
							.then(induction => {
								let slides = (induction.slideCount + 1) || 0;

								// save slide ref in induction array
								InductionModel.findByIdAndUpdate(req.query.inductionId, {
									$inc: { slideCount: 1 },
									$push: {
										slides: {
											slide: mongoose.Types.ObjectId(slide._id),
											order: slides
										}
									}
								}, { new: true })
								.then(updatedInduction => {
									if( updatedInduction ) {
										res.status(200).send({ status: true, message: 'slide saved', data: slide });
									} else {
										res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
										res.status(501).send({ message: 'Slide has failed to save'});
									}
								})
								.catch(next);

						})
						.catch(next);

					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
						res.status(501).send({ message: 'Slide has failed to save'});
					}
				})
				.catch(next);

		}

	},
	// editorSection(req, res, next) {
	// 	if( req.query.action === 'create' ) {
	// 		SlideModel.create(req.body)
	// 			.then(slide => {
	// 				if( slide ) {
	// 					InductionModel.findById(req.query.inductionId)
	// 						.then(induction => {
	// 							let slides = (induction.slideCount + 1) || 0;

	// 							// save slide ref in induction array
	// 							InductionModel.findByIdAndUpdate(req.query.inductionId, {
	// 								$inc: { slideCount: 1 },
	// 								$push: {
	// 									slides: {
	// 										slide: mongoose.Types.ObjectId(slide._id),
	// 										order: slides
	// 									}
	// 								}
	// 							}, { new: true })
	// 							.then(induction => {
	// 								res.status(200).send({ status: true, message: 'slide saved', data: slide });
	// 							})
	// 							.catch(next);

	// 						})
	// 						.catch(next);
						
	// 				} else {
	// 					res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
	// 					res.status(501).send({ message: 'Slide has failed to save'});
	// 				}
	// 			})
	// 			.catch(next);

	// 	} else if ( req.query.action === 'update' ) {
	// 		let buildReq = req.body;
	// 		buildReq['updatedAt'] = new Date();
	// 		SlideModel.findByIdAndUpdate(req.query.slideId, {
	// 			$set: buildReq
	// 		}, { new: true})
	// 		.then(updatedSlide => {
	// 			if( updatedSlide ) {
	// 				res.statusMessage = UtilityFn.rippleSuccessShow('Slide has been updated');
	// 				res.status(200).send({ status: true, message: 'slide updated' });
	// 			} else {
	// 				res.statusMessage = UtilityFn.rippleErr('Slide update has failed to save');
	// 				res.status(501).send({ message: 'Slide update has failed to save'});
	// 			}
	// 		})
	// 		.catch(next);
	// 	}
		
	// },

	// image with caption
	editorImageCaption(req, res, next) {
		let { template, name, status, thumbnail } = req.body;

		let buildSlide = {
			template,
			name,
			resource: [{
				type: 'image',
				source: req.body.mediaId,
				caption: req.body.caption
			}],
			status,
			thumbnail
		};

		if( req.query.slideId ) {

			buildSlide['updatedAt'] = new Date();
			SlideModel.findByIdAndUpdate(req.query.slideId, {
					$set: buildSlide
				}, { new: true})
				.then(updatedSlide => {
					if( updatedSlide ) {
						res.statusMessage = UtilityFn.rippleSuccessShow('Slide has been updated');
						res.status(200).send({ status: true, message: 'Slide has been updated' });
					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to update');
						res.status(501).send({ message: 'Slide has failed to update'});
					}
				})
				.catch(next);

		} else {

			SlideModel.create(buildSlide)
				.then(slide => {
					if( slide ) {
						InductionModel.findById(req.query.inductionId)
							.then(induction => {
								let slides = ++induction.slideCount || 0;

								// save slide ref in induction array
								InductionModel.findByIdAndUpdate(req.query.inductionId, {
									$inc: { slideCount: 1 },
									$push: {
										slides: {
											slide: mongoose.Types.ObjectId(slide._id),
											order: slides
										}
									}
								}, { new: true })
								.then(updatedInduction => {
									if( updatedInduction ) {
										res.status(200).send({ status: true, message: 'slide saved', data: slide });
									} else {
										res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
										res.status(501).send({ message: 'Slide has failed to save'});
									}
								})
								.catch(next);

						})
						.catch(next);

					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
						res.status(501).send({ message: 'Slide has failed to save'});
					}
				})
				.catch(next);

		}

	},

	// text only
	editorTextOnly(req, res, next) {
		let { template, name, status, content, thumbnail } = req.body;

		let buildSlide = {
			template,
			name,
			status,
			content,
			thumbnail
		};

		if( req.query.slideId ) {

			buildSlide['updatedAt'] = new Date();
			SlideModel.findByIdAndUpdate(req.query.slideId, {
					$set: buildSlide
				}, { new: true})
				.then(updatedSlide => {
					if( updatedSlide ) {
						res.statusMessage = UtilityFn.rippleSuccessShow('Slide has been updated');
						res.status(200).send({ status: true, message: 'Slide has been updated' });
					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to update');
						res.status(501).send({ message: 'Slide has failed to update'});
					}
				})
				.catch(next);

		} else {

			SlideModel.create(buildSlide)
				.then(slide => {
					if( slide ) {
						InductionModel.findById(req.query.inductionId)
							.then(induction => {
								let slides = ++induction.slideCount || 0;

								// save slide ref in induction array
								InductionModel.findByIdAndUpdate(req.query.inductionId, {
									$inc: { slideCount: 1 },
									$push: {
										slides: {
											slide: mongoose.Types.ObjectId(slide._id),
											order: slides
										}
									}
								}, { new: true })
								.then(updatedInduction => {
									if( updatedInduction ) {
										res.status(200).send({ status: true, message: 'slide saved', data: slide });
									} else {
										res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
										res.status(501).send({ message: 'Slide has failed to save'});
									}
								})
								.catch(next);

						})
						.catch(next);

					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
						res.status(501).send({ message: 'Slide has failed to save'});
					}
				})
				.catch(next);

		}

	},

	// image only
	editorImageOnly(req, res, next) {
		let { template, name, status, thumbnail } = req.body;

		let buildSlide = {
			template,
			name,
			resource: [{
				type: 'image',
				source: req.body.mediaId
			}],
			status,
			thumbnail
		};

		if( req.query.slideId ) {

			buildSlide['updatedAt'] = new Date();
			SlideModel.findByIdAndUpdate(req.query.slideId, {
					$set: buildSlide
				}, { new: true})
				.then(updatedSlide => {
					if( updatedSlide ) {
						res.statusMessage = UtilityFn.rippleSuccessShow('Slide has been updated');
						res.status(200).send({ status: true, message: 'Slide has been updated' });
					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to update');
						res.status(501).send({ message: 'Slide has failed to update'});
					}
				})
				.catch(next);

		} else {

			SlideModel.create(buildSlide)
				.then(slide => {
					if( slide ) {
						InductionModel.findById(req.query.inductionId)
							.then(induction => {
								let slides = ++induction.slideCount || 0;

								// save slide ref in induction array
								InductionModel.findByIdAndUpdate(req.query.inductionId, {
									$inc: { slideCount: 1 },
									$push: {
										slides: {
											slide: mongoose.Types.ObjectId(slide._id),
											order: slides
										}
									}
								}, { new: true })
								.then(updatedInduction => {
									if( updatedInduction ) {
										res.status(200).send({ status: true, message: 'slide saved', data: slide });
									} else {
										res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
										res.status(501).send({ message: 'Slide has failed to save'});
									}
								})
								.catch(next);

						})
						.catch(next);

					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
						res.status(501).send({ message: 'Slide has failed to save'});
					}
				})
				.catch(next);

		}

	},

	// imageLContentR
	editorImageLContentR(req, res, next) {
		let { template, name, status, content } = req.body;

		let buildSlide = {
			template,
			name,
			content,
			resource: [{
				type: 'image',
				source: req.body.mediaId,
				caption: req.body.caption
			}],
			status
		};

		if( req.query.slideId ) {

			buildSlide['updatedAt'] = new Date();
			SlideModel.findByIdAndUpdate(req.query.slideId, {
					$set: buildSlide
				}, { new: true})
				.then(updatedSlide => {
					if( updatedSlide ) {
						res.statusMessage = UtilityFn.rippleSuccessShow('Slide has been updated');
						res.status(200).send({ status: true, message: 'Slide has been updated' });
					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to update');
						res.status(501).send({ message: 'Slide has failed to update'});
					}
				})
				.catch(next);

		} else {

			SlideModel.create(buildSlide)
				.then(slide => {
					if( slide ) {
						InductionModel.findById(req.query.inductionId)
							.then(induction => {
								let slides = ++induction.slideCount || 0;

								// save slide ref in induction array
								InductionModel.findByIdAndUpdate(req.query.inductionId, {
									$inc: { slideCount: 1 },
									$push: {
										slides: {
											slide: mongoose.Types.ObjectId(slide._id),
											order: slides
										}
									}
								}, { new: true })
								.then(updatedInduction => {
									if( updatedInduction ) {
										res.status(200).send({ status: true, message: 'slide saved', data: slide });
									} else {
										res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
										res.status(501).send({ message: 'Slide has failed to save'});
									}
								})
								.catch(next);

						})
						.catch(next);

					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
						res.status(501).send({ message: 'Slide has failed to save'});
					}
				})
				.catch(next);

		}

	},

	// quiz
	editorQuiz(req, res, next) {
		let { template, name, status, quiz } = req.body;

		let buildSlide = {
			template,
			name,
			status,
			quiz
		};

		if( req.query.slideId ) {

			buildSlide['updatedAt'] = new Date();
			SlideModel.findByIdAndUpdate(req.query.slideId, {
					$set: buildSlide
				}, { new: true})
				.then(updatedSlide => {
					if( updatedSlide ) {
						res.statusMessage = UtilityFn.rippleSuccessShow('Slide has been updated');
						res.status(200).send({ status: true, message: 'Slide has been updated' });
					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to update');
						res.status(501).send({ message: 'Slide has failed to update'});
					}
				})
				.catch(next);

		} else {

			SlideModel.create(buildSlide)
				.then(slide => {
					if( slide ) {
						InductionModel.findById(req.query.inductionId)
							.then(induction => {
								let slides = ++induction.slideCount || 0;

								// save slide ref in induction array
								InductionModel.findByIdAndUpdate(req.query.inductionId, {
									$inc: { slideCount: 1 },
									$push: {
										slides: {
											slide: mongoose.Types.ObjectId(slide._id),
											order: slides
										}
									}
								}, { new: true })
								.then(updatedInduction => {
									if( updatedInduction ) {
										res.status(200).send({ status: true, message: 'slide saved', data: slide });
									} else {
										res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
										res.status(501).send({ message: 'Slide has failed to save'});
									}
								})
								.catch(next);

						})
						.catch(next);

					} else {
						res.statusMessage = UtilityFn.rippleErr('Slide has failed to save');
						res.status(501).send({ message: 'Slide has failed to save'});
					}
				})
				.catch(next);
		}
	},

	/* ==[ EDITOR > QUIZ ]== */

	// create a quiz
	createQuiz(req, res, next) {
		res.send(req.body);
	},

	cloneInduction(req, res, next) {
		const inductionId = req.query.inductionId;

		InductionModel.findById(inductionId)
			.lean()
			.then(trgtInduction => {
				if( trgtInduction ) {
					// build induction
					let buildInd = {
						user: mongoose.Types.ObjectId(trgtInduction.user),
						name: trgtInduction.name + ' - Clone',
						category: mongoose.Types.ObjectId(trgtInduction.category),
						slides: trgtInduction.slides
					};

					InductionModel.create(buildInd)
						.then(newInduction => {
							if( newInduction ) {
								res.send({ status: true });
							} else {
								res.statusMessage = UtilityFn.rippleErr('Cloning induction has failed');
								res.status(422).send({ message: 'Cloning induction has failed'});
							}
						})
						.catch(next);

				} else {
					res.statusMessage = UtilityFn.rippleErr('Induction not found');
					res.status(422).send({ message: 'Induction not found'});
				}
			})
			.catch(next);
	}

};