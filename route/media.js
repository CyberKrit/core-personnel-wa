const MediaController = require('../controller/media');
let upload = require('../config/multer.config');

module.exports = (app) => {

	app.post('/api/media/upload', upload.single('file'), MediaController.upload);

};