module.exports = {

	ripple(visible, type, client, dev) {
		// @type: success, error, warning
		
		return `{"type":"${type || ''}","client":"${client || ''}","dev":"${dev || ''}","visible":${visible || false}}`;
	}

};