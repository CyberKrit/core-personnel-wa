module.exports = {

	upload(req, res, next) {console.log(req.file);
		res.send({ storedFileName: req.file.filename });
	}

};