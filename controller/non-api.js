const UserModel = require('../model/user');
const moment = require('moment');
const config = require('../config/config');

module.exports = {

	verifyEmail(req, res) {

		const getToken = req.query.token;

		if( getToken ) {
			UserModel.findByEmailToken(getToken)
				.then(user => {

					let tokenIndex;
					// find token position is user email verification array
					user.emailVerification.forEach(({ token }, index) => {
						tokenIndex = ( token === getToken ) ? index : null;
					});
					// cache position for late use
					let tokenPos = user.emailVerification[tokenIndex];

					// day difference
					let start = moment(user.createdAt);
					let now = moment(new Date());
					let duration = moment.duration(now.diff(start));
					let days = duration.asDays();

					// if true return else update database
					if( tokenPos.isverified === true ) {
						res.status(200).send({ message: 'email is already verified' });
						return;
					} else {
						if( days > config.emailConfirmationExp ) {
							tokenPos.isExpired = true;
							tokenPos.isverified = false;
						} else {
							tokenPos.isverified = true;
							tokenPos.isExpired = true;
						}
					}

					if( days > config.emailConfirmationExp ) {
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