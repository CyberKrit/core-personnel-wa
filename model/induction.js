const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InductionSchema = new Schema({
	name: { type: String, require: true },
	category: { type: Schema.Types.ObjectId, ref: 'inductionCat' },
	views: { type: Number, require: true, default: 0 },
	completed: { type: Number, require: true, default: 0 },
	slides: [{
		template: { type: Schema.Types.ObjectId, ref: 'template' },
		name: { type: String, default: null },
		variation: { type: String, required: true, enum:['template', 'quiz'], default: 'template' },
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
		createdAt: { type: Date, required: true, default: Date.now },
		updatedAt: { type: Date, required: true, default: Date.now }
	}],
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'induction' });

const Induction = mongoose.model('induction', InductionSchema);
module.exports = Induction;