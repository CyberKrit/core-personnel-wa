const UserModel = require('../model/user');
const moment = require('moment');

module.exports = {

	verifyEmail(req, res) {

		const getToken = req.query.token;

		if( getToken ) {
			UserModel.findByEmailToken(getToken)
				.then(user => {
					let start = moment(user.createdAt);
					let now = moment(new Date());
					let duration = moment.duration(now.diff(start));
					let days = duration.asDays();

					if( user.emailVerification[0].isverified === true ) {
						res.status(200).send({ message: 'email is already verified' });
						return;
					}

					if( days > 3 ) {
						user.emailVerification = [];
					} else {
						user.emailVerification[0].isverified = true;
					}

					if( days > 3 ) {
						user.save()
							.then(updatedUser => {
								if( updatedUser ) {
									res.status(403).send({ message: 'token expired' });
								} else {
									res.status(422).send({ message: 'email verification reset has failed.' });
								}
							})
							.catch(err => {
								res.status(422).send(err);
							});
						
					} else {
						user.save()
							.then(updatedUser => {
								res.status(200).send({ message: 'successfully verified' });
							})
							.catch(err => {
								res.status(401).send({ message: 'invalid token' });
							});
						} // endif

				})
				.catch(err => {
					res.status(401).send(err);
				});
		} else {
			res.status(401).send({ message: 'invalid token' });
		}


	}

};