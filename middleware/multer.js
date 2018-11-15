const multer = require('multer');
const path = require('path');
 
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, './public/uploads')
	},

	filename: (req, file, cb) => {
		let filename = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
	  cb(null, filename + '-' + Date.now() + path.extname(file.originalname).toLowerCase())
	}
});
 
var upload = multer({
	storage: storage,

	fileFilter: function (req, file, cb) {
	  var filetypes = /jpg|jpeg|png|gif/;
	  var mimetype = filetypes.test(file.mimetype);
	  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

	  if (mimetype && extname) {
	    return cb(null, true);
	  }
	  cb("Error: File upload only supports the following filetypes - " + filetypes);
	}
}).single('file');

module.exports = upload;