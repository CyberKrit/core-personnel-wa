const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AbandonedSubsSchema = new Schema({
	company: { type: String, required: true, default: null },
	email: { type: String, required: true, lowercase: true, trim: true, unique: true },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'abandonedSubs' });

const AbandonedSubs = mongoose.model('abandonedSubs', AbandonedSubsSchema);

module.exports = AbandonedSubs;