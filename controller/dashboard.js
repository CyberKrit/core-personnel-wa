const UserModel = require('../model/user');

module.exports = {

	load(req, res) {
		res.json({ token: req.token, user: req.user });
	}

};