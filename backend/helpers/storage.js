const multer = require('multer');


const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split('/');
    let fileType = mimeType[1];
    if (fileType == 'svg+xml') { fileType = 'svg' }
    const fileName = `${file.originalname}-${Date.now()}.${fileType}`
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/heic', 'image/heif'];
  allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single(
  'file'
);

module.exports = storage;
