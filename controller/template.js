const TemplateModel = require('../model/template');

module.exports = {

	create(req, res, next) {
		let { name, component } = req.body;
		let slug = name.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');

		let buildReq = { name, slug, component };

		TemplateModel.create(buildReq)
			.then(template => {
				if( template ) {
					res.send({ message: 'template was created successfully' });
				} else {
					next();
				}
			})
			.catch(next);
	},

	list(req, res, next) {
		TemplateModel.find()
			.then(templates => {
				if( templates.length ) {
					let buildRes = [];
					templates.map(( { _id, name, slug, byDefault, component } ) => {
						buildRes.push({ _id, name, slug, byDefault, component });
					});
					res.status(200).send(buildRes);
				} else {
					next();
				}
			})
			.catch(next);
	}

};