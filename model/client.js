const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
	firstname: { type: String, default: null },
	middlename: { type: String, default: null },
	lastname: { type: String, default: null },
	email: { type: String, required: true, lowercase: true, trim: true, unique: true },
	password: { type: String, required: true },
	tel: { type: String, required: true, unique: true },
	age: { type: Number, default: null },
	address: { type: String, default: null },
	companyDetails: [{
		name: { type: String, required: true, default: null },
		type: { type: String, required: true, default: null },
		registered: { type: String, default: null }
	}],
	invoice: [{
		subscription: { type: String, required: true, default: null },
		amount: { type: Number, required: true, default: 0 },
		issued: { type: Date, required: true, default: Date.now }
	}],
	subCount: { type: Number, required: true, default: 0 },
	amountSpent: { type: Number, required: true, default: 0 },
	payment: [{
		type: { type: Number, required: true },
		name: { type: String, required: true },
		cvv: { type: Number, required: true },
		expire: { type: String, required: true }
	}],
	userType: { type: String, required: true, default: 'client' },
	approved: { type: Boolean, required: true, lowercase: true, default: false },
	status: { type: String, required: true, default: 'suspend' },
	tokens: [{
		access: { type: String, required: true },
		token: { type: String, required: true }
	}],
	userList: [{
		id: { type: Schema.Types.ObjectId, ref: 'user' },
	}],
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'client' });

const Client = mongoose.model('client', ClientSchema);
module.exports = Client;