const verifyToken = require('../middlewares/verifyToken');
const ObjectId = require('mongoose').Types.ObjectId
const { body } = require('express-validator')
const { validationResult } = require('express-validator');
const { transporter } = require('../controllers/email')
const router = require('express').Router();
const { avatar, banner } = require('../helpers/avatar')
const User = require('../models/User');
const Collection = require('../models/Collection')
const Item = require('../models/Item')
const Request = require('../models/Request');
const Recovery = require('../models/Recovery')
const fs = require('fs')
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.json(errors.array())
	}

	const { name, lastName, email, password, role, banned, google } = req.body;
	if (!password && !google) return res.status(401).send("Missing Password")
	const newUser = new User({ name, lastName, email, password, role, banned, banner: './assets/img/member-background.png', avatar: 'http://localhost:4000/images/useravatars/default.svg', google });

	const token = await jwt.sign({ _id: newUser._id }, 'secretkey');
	if (newUser.name == null || newUser.name == '' || newUser.lastName == null || newUser.lastName == '' || newUser.email == null || newUser.email == '' || newUser.password == null || newUser.password == '') {
		res.json({ success: false, message: 'Ensure username, email and password were provided' });
	} else {
		await newUser.save(function (err) {
			if (err) {
				console.log(err)
				res.status(401).json({ success: false, message: 'Email already exists!' });
			} else {
				res.status(200).json({ token, avatar: newUser.avatar });
			}
		});
	}
});

router.post('/login', async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json(errors.array());
	}


	const { email, password, google } = req.body;
	const user = await User.findOne({ email });
	if (!user) return res.status(401).send("The email doesn't exist");

	if (!google) {
		if (!user.password) return res.status(409).send('Google account')
		if (!await user.comparePassword(password)) return res.status(409).send('Wrong password');
	}

	const token = jwt.sign({ _id: user._id, role: user.role }, 'secretkey');

	if (user.banned) return res.status(403).json({ token: token, avatar: user.avatar });
	return res.status(200).json({ token, avatar: user.avatar });
});


router.get('/Admin-Panel', verifyToken, (req, res) => {
	res.send(req.userId);
});

router.get('/Profile', verifyToken, (req, res) => {
	res.send(req.userId);
});

router.get('/role', verifyToken, async (req, res) => {
	const user = await User.findById(req.userId).select({ role: 1 });
	res.send({ role: user.role })
});

router.get('/getUsers', verifyToken, async (req, res) => {
	const users = await User.find({}, ['name', 'lastName', '_id', 'role', 'banned', 'email', 'avatar'])
	res.send({ users: users, admin: req.userId })
})

router.post('/getProfile', verifyToken, async (req, res) => {
	let { id } = req.body;
	if (!id) { id = req.userId }

	if (ObjectId.isValid(id)) {
		const user = await User.findById(id, ['_id', 'role', 'banner', 'name', 'lastName', 'avatar', 'socialMedia', 'category', 'description']).lean()
		let response = {
			_id: user._id,
			role: user.role,
			name: user.name,
			lastName: user.lastName,
			category: user.category,
			description: user.description,
			isOwnProfile: id == req.userId,
			avatar: user.avatar,
			banner: user.banner,
			socialMedia: user.socialMedia,
			collections: []
		}
		response.collections = await Collection.find({ authors: ObjectId(id) }, ['name', 'content', 'public', 'authors', 'thumbnails']).lean()


		for (let collection of response.collections) {
			const visitor = await User.findById(req.userId, ['role']).lean()

			if (visitor.role == 'Guest' || (!collection.public && ['Guest'].includes(visitor.role))) {
				collection['locked'] = true
			}

			for (let i = collection.authors.length; i >= 0; i--) {

				const info = await User.findById(collection.authors[i], ['name', 'avatar'])

				if (info) {
					collection.authors[i] = info
				} else {
					collection.authors.splice(i, 1)
				}
			}
		}

		if (!(['Guest', 'Guest with access'].includes(user.role))) {
			res.status(200).send(response)
		} else {
			res.status(404).send(undefined)
		}
	} else {
		res.status(404).send(undefined)
	}
})

router.get('/getUser', verifyToken, async (req, res) => {
	const user = await User.findById(req.userId, ['name', 'lastName', 'role', 'email', 'banned', 'banner'])
	res.status(200).send(user)
})

router.post('/setRole', verifyToken, async (req, res) => {
	const { user, role } = req.body

	await User.findByIdAndUpdate(user, { 'role': role });
	res.status(200).send("OK")
})

router.post('/banUser', verifyToken, async (req, res) => {
	const { id, text } = req.body
	const user = await User.findByIdAndUpdate(id, { 'banned': text })

	await Request.findOneAndDelete({ type: 'appeal', userId: id })
})

router.get('/isBanned', verifyToken, async (req, res) => {
	const user = await User.findById(req.userId, ['banned'])
	res.status(200).send(user)
})

router.get('/familyMembers', async (req, res) => {
	const family = await User.find({ 'role': { $in: ['Family member', 'Admin'] } }, ['name', 'lastName', 'avatar']).lean()
	response = { family: family }

	res.send(response)
})

router.get('/id', verifyToken, async (req, res) => {
	const family = await User.find({ 'role': { $in: ['Family member', 'Admin'] } }, ['name', 'lastName', 'avatar']).lean()
	return res.status(200).send({ family: family, id: req.userId })
})

router.post('/google', async (req, res) => {
	const { email, sub } = req.body
	const usedEmail = await User.findOne({ email: email })
	const isLinked = await User.findOne({ google: sub })

	let user = { exists: !!usedEmail, linked: !!isLinked, email: '' }

	if (isLinked) {
		user.email = isLinked.email
	}

	res.send(user)
})

router.post('/googleLink', async (req, res) => {
	const { email, password, sub } = req.body
	const user = await User.findOne({ email: email })

	if (!user) return res.status(404).send("User doesn't exist")

	if (!await user.comparePassword(password)) return res.status(409).send('Wrong password');

	User.findByIdAndUpdate(user._id, { google: sub },
		function (err, result) {

			if (err) {
				console.log(err)

			} else {
				result.google = sub
				result.save();
				return res.status(200).send({})
			}
		})
})

router.post('/gAvatar', verifyToken, async (req, res) => {
	const { url } = req.body

	await User.findByIdAndUpdate(req.userId, { avatar: url })
	res.send({ url })
})

router.post('/setAvatar', avatar, async (req, res) => {
	res.status(200).send({ message: "OK" })
})

router.post('/setBanner', banner, async (req, res) => {
	res.status(200).send({ message: "OK" })
})

router.get('/avatar', verifyToken, async (req, res) => {
	const userAvatar = await User.findById(req.userId, ['avatar'])
	res.send(userAvatar)
})

router.post('/updateUser', verifyToken, async (req, res) => {

	User.findByIdAndUpdate(req.userId, req.body, function (err, user) {
		if (err) {
			return res.status(401).json({ error: "Email already exists" })
		} else {
			if (req.body.password) { user.password = req.body.password }
			user.save()
			return res.status(200).send({})
		}
	})
})

router.get('/deleteUser', verifyToken, async (req, res) => {

	const user = await User.findById(req.userId)
	const avatar = user.avatar.split('/')

	if (!(avatar[2] == 'lh3.googleusercontent.com')) {
		fs.unlink(`images/useravatars/${avatar[5]}`, (err) => {
			console.log(err)
		})
	}

	await User.findByIdAndDelete(req.userId)

	return res.status(200).send({})
})

router.post('/forgotPassword', async (req, res) => {

	const user = await User.findOne(req.body, ['email', 'name', 'lastName'])
	const priorRequest = await Recovery.findOne(req.body)

	if (priorRequest) {
		priorRequest.delete()
	}

	if (user) {
		const newRequest = new Recovery({ user: user._id })

		newRequest.save(function (err, info) {
			if (err) {
				console.log(err)
			} else {
				res.status(200).send({ user: user, request: info })
			}
		})

	} else {
		res.status(404).send({ message: "email doesn't exist" })
	}
})

router.post('/recoverPassword', async (req, res) => {
	const { id } = req.body

	if (ObjectId.isValid(id)) {
		const request = await Recovery.findById(id, ['user'])

		if (request) {
			return res.status(200).send(request)
		}
	}

	res.status(404).send({ message: "Request doesn't exist" })
})

router.post('/resetPassword', async (req, res) => {
	const { id, password } = req.body

	await Recovery.deleteOne({ user: id })

	User.findByIdAndUpdate(id, {}, function (err, user) {
		if (err) {
			console.log(err)
		} else {
			user.password = password
			user.save()
			res.status(200).send({})
		}
	})
})

router.get('/library', async (req, res) => {
	let users = await User.find({ role: { $in: ['Family member', 'Friend', 'Admin'] } },
		['name', 'avatar', 'socialMedia']);

	res.status(200).send(users)
})

router.post('/addSocialMedia', verifyToken, async (req, res) => {
	const { site, user, link } = req.body
	let account = { site: site, link: link };

	const target = await User.findById(req.userId)

	siteExists = false
	for (let socialSite of target.socialMedia) {
		if (socialSite.site == site) {
			siteExists = true
			socialSite.accounts.push({ user: user, link: link })
			target.markModified('socialMedia')
			target.save()
			break
		}
	}

	if (!siteExists) {
		target.socialMedia.push({ site: site, accounts: [{ user: user, link: link }] })
		target.save()
	}


	res.status(200).send({})
})

router.post('/delSocialMedia', verifyToken, async (req, res) => {
	const siteI = req.body[0]
	const accI = req.body[1]

	var user = await User.findById(req.userId)

	user.socialMedia[siteI].accounts.splice(accI, 1)

	if (user.socialMedia[siteI].accounts.length < 1) {
		user.socialMedia.splice(siteI, 1)
	}

	user.markModified('socialMedia')
	user.save()
	res.status(200).send({})
})


// Requests -------------------------------------------------------------------- //
router.get('/requestList', async (req, res) => {
	const requests = await Request.find();

	for (let request of requests) {
		const user = await User.findById(request.user, ['avatar'])
		request.avatar = user.avatar
	}

	res.status(200).send(requests)
})

router.post('/requestAccess', verifyToken, async (req, res) => {
	const details = await User.findById(req.userId, ['name', 'email', 'avatar'])
	const { type, organisation, purpose, item, description } = req.body

	if (purpose) {
		var existingRequest = await Request.findOne({ user: req.userId, type: type })

		if (existingRequest) {
			return res.status(401).send({})
		}

		new Request({
			type: type,
			user: req.userId,
			userName: details.name,
			avatar: details.avatar,
			email: details.email,
			organisation: organisation,
			item: item,
			purpose: purpose,
			description: description
		}).save()
		res.status(200).send({})

	} else {
		res.status(400).send()
	}
})

router.get('/requestExists', verifyToken, async (req, res) => {
	const code = await Request.findOne({ user: req.userId, type: 'access' }) ? 400 : 200

	return res.status(code).send({})
})

router.post('/removeRequest', verifyToken, async (req, res) => {
	const { request } = req.body;
	await Request.findByIdAndDelete(request);
	res.status(200).send({});
})

router.post('/sendEmail', async (req, res) => {
	let { subject, to, content, toUser } = req.body

	if (toUser) {
		const user = await User.findById(toUser, ['name', 'lastName', 'email'])
		to = `"${user.name} ${user.lastName}" "${user.email}"`
	}

	const email = `           
	<body style="background:#eeeeee; padding: 5rem">
		<div style="width:774px; margin:auto; border:1px solid lightgray; border-radius:5px; background:white; margin: 2rem auto 2 rem auto; box-shadow:0px 4px 23px gray">

			<h1 style="font-family: 'Georgia'; text-align:center; font-size:28px; font-weight:400">${subject}</h1>

			<div style="margin: auto; width: 616px; border:1px solid #848198; border-radius: 1px; background: #FBFDFF; padding:1rem">
				<p style ="font-family:Helvetica; font-weight:400; font-size:17px; line-height:145%" >
					${content}
				</p>
			</div>

			<a href="http://shikhman.org/Contact-Us" style="margin:auto; text-decoration: none; color: white;">
				<div style=" display:flex; width:208px; height:53px; margin:auto; background:#232227; border-radius:74px; margin: 2rem auto 2rem auto">
					<p style="color: white; font-size: 17px; font-weight: 400; margin:auto">Send message</p>
				</div>
			</a>

		</div>
	</body>
	`

	await transporter.sendMail({
		from: '"Shikhman" "<Shikhmantest@gmail.com>"',
		to: to,
		subject: subject,
		html: email
	});
})

module.exports = router;