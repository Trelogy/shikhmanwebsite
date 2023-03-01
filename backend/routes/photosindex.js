const router = require('express').Router();
const photosController = require('../controllers/photos');
const verifyToken = require('../middlewares/verifyToken');

const storage = require('../helpers/storage');

router.get('/', verifyToken, photosController.getPhotos);

router.post('/', verifyToken, storage, photosController.postPhoto);

router.get('/:id',verifyToken, photosController.getPhoto);

router.delete('/:id', storage, verifyToken, photosController.deletePhoto);

router.put('/:id',verifyToken, photosController.editPhoto);

module.exports = router;
