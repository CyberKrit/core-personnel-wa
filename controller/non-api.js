const UserModel = require('../model/user');

module.exports = {

	verifyEmail(req, res) {

		const getToken = req.query.token;

		if( getToken ) {
			UserModel.findByEmailToken(getToken)
				.then(user => {
					user.emailVerification[0].isverified = true;
					user.save()
						.then(updatedUser => {
							res.send({ status: true });
						})
						.catch(err => {
							res.status(422).send({ message: 'invalid token' });
						});
				})
				.catch(err => {
					res.status(422).send({ message: 'invalid token' });
				});
		} else {
			res.send({ status: false });
		}


	}

};