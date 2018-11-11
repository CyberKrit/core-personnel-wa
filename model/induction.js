const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InductionSchema = new Schema({
	name: { type: String, require: true },
	category: { type: Schema.Types.ObjectId, ref: 'inductionCat' },
	slides: [{
		template: { type: Schema.Types.ObjectId, ref: 'template' },
		name: { type: String, default: null },
		header: { type: String, default: null },
		content: { type: String, default: null },
		resource: [{
			type: { type: String, default: null },
			source: { type: String, default: null },
			caption: { type: String, default: null }
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