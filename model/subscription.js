const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
	name: { type: String, require: true },
	price: { type: Number, require: true },
	duration: { type: Number, require: true },
	currency: { type: String, require: true },
	limit: { type: Number, require: true },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'subscription' });

const Subscription = mongoose.model('subscription', SubscriptionSchema);

module.exports = Subscription;