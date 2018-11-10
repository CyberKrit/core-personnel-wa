const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InductionSchema = new Schema({
	name: { type: String, require: true },
	category: { type: Schema.Types.ObjectId, ref: 'inductionCat' },
	slides: [{
		template: { type: Schema.Types.ObjectId, ref: 'template' },
		title: { type: String, trim: true },
		subTitle: { type: String, trim: true },
		content: { type: String, trim: true },
		media: [{
			asset: { type: Schema.Types.ObjectId, ref: 'media' }
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