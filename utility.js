module.exports = {

	ripple(visible, type, client, dev) {
		// @type: success, error, warning
		
		return `{"type":"${type || ''}","client":"${client || ''}","dev":"${dev || ''}","visible":${visible || false}}`;
	},

	rippleSuccess(visible, type, client, dev) {
		// @type: success, error, warning
		
		return `{"type":"success","client":"${client || ''}","dev":"${dev || ''}","visible":true}`;
	},

	rippleErr(client, dev) {
		// @type: success, error, warning
		
		return `{"type":"error","client":"${client || ''}","dev":"${dev || ''}","visible":true}`;
	}

};