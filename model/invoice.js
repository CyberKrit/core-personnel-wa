const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
	client: { type: Schema.Types.ObjectId, ref: 'client' },
	status: { type: String, require: true, eum: ['paid', 'unpaid'], default: 'unpaid' }
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'invoice' });

const Invoice = mongoose.model('invoice', InvoiceSchema);
module.exports = Invoice;