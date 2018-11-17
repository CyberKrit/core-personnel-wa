const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
	src: { type: String, require: true },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'media' });

const Media = mongoose.model('media', MediaSchema);
module.exports = Media;