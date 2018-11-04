const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InductionSchema = new Schema({
	name: { type: String, require: true },
	category: { type: Schema.Types.ObjectId, ref: 'inductionCat' },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'induction' });

const Induction = mongoose.model('induction', InductionSchema);
module.exports = Induction;