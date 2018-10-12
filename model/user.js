const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstname: { type: String, default: null },
	middlename: { type: String, default: null },
	lastname: { type: String, default: null },
	email: { type: String, required: true, lowercase: true, trim: true, unique: true },
	password: { type: String, required: true },
	tel: { type: String, required: true, unique: true },
	age: { type: Number, default: null },
	address: { type: String, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'user' });

const User = mongoose.model('user', UserSchema);
module.exports = User;