const config = require('../config/config');

module.exports = {

	upload(req, res, next) {
		console.log(req.file);
		res.send({ fileSrc: config.fileUploadPath + req.file.filename });
		next();
	}

};