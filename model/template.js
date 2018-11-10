const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
	name: { type: String, require: true },
	slug: { type: String, require: true },
	leveraged: { type: Number, required: true, default: 0 },
	byDefault: { type: Boolean, required: true, default: false },
	component: [{
		heroText: { type: Boolean, default: false },
		heroImage: { type: Boolean, default: false },
		heroVideo: { type: Boolean, default: false },
		content: { type: Boolean, default: false },
		imageCaption: { type: Boolean, default: false },
		imageLContent: { type: Boolean, default: false },
		imageRContent: { type: Boolean, default: false },
		contentImageGrid: { type: Boolean, default: false },
		quiz: { type: Boolean, default: false }
	}],
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now }
}, { collection: 'template' });

const Template = mongoose.model('template', TemplateSchema);
module.exports = Template;