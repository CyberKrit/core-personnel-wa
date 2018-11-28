const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlideSchema = new Schema({
	template: { type: Schema.Types.ObjectId, ref: 'template' },
	thumbnail: { type: String, default: '', required: true },
	name: { type: String, default: null },
	header: { type: String, default: null },
	content: { type: String, default: null },
	resource: [{
		type: { type: String, required: true, default: 'image', enum:['image', 'video'] },
		source: { type: Schema.Types.ObjectId, ref: 'media' },
		caption: { type: String, default: null },
		alt: { type: String, default: null },
		desc: { type: String, default: null },
		position: { type: String, default: null },
		size: { type: String, default: null }
	}],
	status: { type: String, enum:['draft', 'publish'], required: true, default: 'draft' },
	quiz: {
		question: { type: String, default: null },
		options: [{
			option: { type: String, required: true, default: '' },
			isTrue: { type: Boolean, required: true, default: false }
		}],
		control: { type: String, required: true, enum: ['reveal', 'retry'], default: 'reveal'}
	},
	next: { type: Boolean, required: true, default: true },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'slide' });

const Slide = mongoose.model('slide', SlideSchema);
module.exports = Slide;