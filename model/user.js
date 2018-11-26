const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// custom import
const config = require('../config/config');

const UserSchema = new Schema({
	email: { type: String, required: true, lowercase: true, trim: true, unique: true },
	password: { type: String, required: true },
	tel: { type: String, trim: true, unique: true, sparse: true },
	personal: [{
		firstname: { type: String, default: null },
		middlename: { type: String, default: null },
		lastname: { type: String, default: null },
		age: { type: Number, default: null }
	}],
	company: [{
		name: { type: String, required: true, default: null },
		type: { type: String, default: null },
		size: { type: String, default: null },
		founded: { type: Date, default: null }
	}],
	address: [{
		number: { type: String, default: null },
		street: { type: String, default: null },
		city: { type: String, default: null },
		state: { type: String, default: null },
		zip: { type: String, default: null },
		country: { type: String, default: null }
	}],
	subscriptionMode: { type: String, required: true, enum:['auto', 'wait'], default: 'auto' },
	subscription:[{
		id: { type: Schema.Types.ObjectId, ref: 'subscription' },
		subscribeAt: { type: Date, required: true, default: Date.now },
		status: { type: String, required: true, enum: ['trial', 'expire', 'active', 'wait', 'unset'], default: 'unset' }
	}],
	emailVerification: [{
		type: { type: String, required: true, default: 'email' },
		token: { type: String, required: true },
		isverified: { type: Boolean, required: true, default: false },
		isExpired: { type: Boolean, required: true, default: false },
		createdAt: { type: Date, required: true, default: Date.now }
	}],
	status: [{
		emailVerification: { type: Boolean, required: true, default: false },
		phoneVerification: { type: Boolean, required: true, default: false },
		active: { type: String, required: true, enum: ['yes', 'no', 'view'], default: 'no' }
	}],
	userType: { type: String, required: true, enum: ['client', 'user'], default: 'user' },
	paymentMethod: { type: String, required: true, enum: ['stripe', 'paypal'], default: 'stripe' },
	stripe: [{ 
		customerId: { type: String, required: true, default: null },
		cardId: { type: String, required: true, default: null },
		cardNumber: { type: Number, required: true, default: null },
		brand: { type: String, required: true, default: null },
		expMonth: { type: String, required: true, default: null },
		expYear: { type: String, required: true, default: null },
		funding: { type: String, required: true, default: null }
	}],
	invoice: [{
		id: { type: Schema.Types.ObjectId, ref: 'invoice' }
	}],
	roleManagement: [{
		permission: { type: String, required: true, enum: ['create', 'read', 'update', 'delete', 'all', 'none'], default: 'all' }
	}],
	tokens: [{
		type: { type: String, required: true },
		token: { type: String, required: true }
	}],
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'user' });

// UserSchema.methods.toJSON = function() {
// 	let user = this;
// 	let buildRes = user.toObject();

// 	return { company: buildRes.company[0].name }
// };

UserSchema.pre('save', function(next) {
	let user = this;

	if( user.isModified('password') ) {
		bcrypt.hash(user.password, 10, function(err, hash) {
			user.password = hash;
			next();
		});
	} else {
		next();
	}

});

UserSchema.statics.findByToken = function(token) {
	let User = this, decode;

	try {
		decode = jwt.verify(token, config.jwtSecret);
	} catch(err) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decode._id,
		'tokens.type': 'auth',
		'tokens.token': token
	});

};

UserSchema.statics.findByEmailToken = function(token) {
	let User = this, decode;

	try {
		decode = jwt.verify(token, config.jwtSecret);
	} catch(err) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decode._id,
		'emailVerification.type': 'email',
		'emailVerification.token': token
	});

};

UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let type = 'auth';
	let token = jwt.sign({ type, _id: user._id.toHexString() }, config.jwtSecret);

	user.tokens = [];
	user.tokens.push({ type, token });

	return user.save()
		.then( updatedUser => {
			return { token, user: updatedUser };
		});
};

UserSchema.methods.generateEmailToken = function() {
	let type = 'email',
			token = jwt.sign({ type, _id: this._id.toHexString() }, config.jwtSecret);

	this.emailVerification.push({
		type,
		token: token,
		isverified: false,
		isExpired:false,
		createdAt: Date.now()
	});

	return this.save()
		.then( updatedUser => {
			return { token }
		});

}

UserSchema.statics.findByCredentials = function(email, pwd) {
	let User = this;

	return User.findOne({ email })
		.then(user => {
			if( !user ) return Promise.reject();

			return new Promise((resolve, reject) => {
				bcrypt.compare(pwd, user.password, (err, res) => {
					if( !res ) reject();
					resolve(user);
				});
			});

		});

};


const User = mongoose.model('user', UserSchema);
module.exports = User;