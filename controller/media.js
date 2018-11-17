const Media = require('../model/media');
const config = require('../config/config');

module.exports = {

	upload(req, res, next) {
		if( req.file ) {
			let buildMedia = {
				src: config.fileUploadPath + req.file.filename
			};

			Media.create(buildMedia)
				.then(media => {
					if( media ) {
						let { src, _id } = media;
						res.send({ src, _id });
					} else {
						res.statusMessage = UtilityFn.rippleErr('File has failed to save');
						res.status(422).send({ message: 'File has failed to save' });
					}
				})
				.catch(next);
		} else {
			next();
		}
	}

};