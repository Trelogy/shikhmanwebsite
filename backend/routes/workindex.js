const verifyToken = require('../middlewares/verifyToken');
const router = require('express').Router();
const worksController = require('../controllers/works');

const storage = require('../helpers/storage');

router.post('/getWorks', verifyToken, worksController.getWorks);

router.post('/addWork', verifyToken, worksController.addWork);

router.post('/addPic', verifyToken, worksController.addPic)

router.post('/delPic', verifyToken, worksController.delPic)

router.get('/delete/:id', verifyToken, storage, worksController.deleteWork);

router.get('/:id', verifyToken, worksController.getWork);

router.post('/editWork', verifyToken, worksController.editWork);

router.post('/addVideo', verifyToken, worksController.addVideo);

router.post('/editVideo', verifyToken, worksController.editVideo);

router.post('/deleteVideo', verifyToken, worksController.deleteVideo);

module.exports = router;