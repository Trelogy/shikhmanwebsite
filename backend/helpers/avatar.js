const multer = require('multer');
const User = require('../models/User')

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/useravatars')
    },
    filename: async function (req, file, cb) {
        const userId = JSON.parse(atob(req.headers.authorization.split('.')[1]))
        const ext = `.${file.mimetype.split('/')[1]}`

        await User.findByIdAndUpdate(userId._id, { avatar: `http://localhost:4000/images/useravatars/${userId._id}${ext}` })


        cb(null, `${userId._id}${ext}`)
    }
})

const bannerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/banners')
    },
    filename: async function (req, file, cb) {
        const userId = JSON.parse(atob(req.headers.authorization.split('.')[1]))
        const ext = `.${file.mimetype.split('/')[1]}`

        await User.findByIdAndUpdate(userId._id, { banner: `http://localhost:4000/images/banners/${userId._id}${ext}` })


        cb(null, `${userId._id}${ext}`)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/heic'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};


const avatar = multer({ storage: avatarStorage, fileFilter: fileFilter }).single('avatar');

const banner = multer({ storage: bannerStorage, fileFilter: fileFilter }).single('banner');

module.exports = { avatar, banner }
