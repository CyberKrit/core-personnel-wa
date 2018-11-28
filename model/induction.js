const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InductionSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'user' },
	name: { type: String, require: true },
	category: { type: Schema.Types.ObjectId, ref: 'inductionCat' },
	views: { type: Number, require: true, default: 0 },
	completed: { type: Number, require: true, default: 0 },
	slideCount: { type: Number, require: true, default: 0 },
	slides: [{
		slide: { type: Schema.Types.ObjectId, ref: 'slide' },
		order: { type: Number, required: true, default: null }
	}],
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'induction' });

const Induction = mongoose.model('induction', InductionSchema);
module.exports = Induction;