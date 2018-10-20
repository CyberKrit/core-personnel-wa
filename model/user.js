const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	personal: [{
		firstname: { type: String, default: null },
		middlename: { type: String, default: null },
		lastname: { type: String, default: null },
		age: { type: Number, default: null }
	}],
	credentials: [{
		email: { type: String, required: true, lowercase: true, trim: true, unique: true },
		password: { type: String, required: true },
		tel: { 
			type: String, 
			trim: true, 
			index: { 
				unique: true, 
				partialFilterExpression: { email: {$type: 'string'} } 
			} 
		}
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
	status: [{
		emailVerification: { type: Boolean, required: true, default: false },
		phoneVerification: { type: Boolean, required: true, default: false },
		active: { type: Boolean, required: true, default: false }
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
		access: { type: String, required: true },
		token: { type: String, required: true }
	}],
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'user' });

const User = mongoose.model('user', UserSchema);
module.exports = User;