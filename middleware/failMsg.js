const UtilityFn = require('../utility');

let failMsg = (msg) => {
	return (req, res, next) => {
		req.ifErr = UtilityFn.rippleErr(msg);
		next();
	};
};

module.exports = { failMsg };