const MediaController = require('../controller/media');
let Upload = require('../middleware/multer');

module.exports = (app) => {

	app.post('/api/media/upload', Upload, MediaController.upload);

};