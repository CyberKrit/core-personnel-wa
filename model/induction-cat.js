const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InductionCatSchema = new Schema({
	name: { type: String, require: true },
	slug: { type: String, require: true },
	inductions: [{
		induction: { type: Schema.Types.ObjectId, ref: 'induction' },
	}],
	user: { type: Number, require: true, default: null },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'inductionCat' });

const InductionCat = mongoose.model('inductionCat', InductionCatSchema);
module.exports = InductionCat;