const Photo = require('../models/Photo');
const Work = require('../models/Work');
const User = require('../models/User');
const Video = require('../models/Video')
const path = require('path');
const fs = require('fs')
const ObjectId = require('mongoose').Types.ObjectId

exports.addWork = async (req, res) => {
  const author = await User.findById(req.userId);
  const { name, date, description, socialm, medium, public, content, authors, thumbnail, video } = req.body


  const work = new Work({
    name: name,
    date: date,
    description: description,
    socialm: socialm,
    medium: medium,
    public: public,
    content: content,
    user: req.userId,
    authors: authors,
    content: [],
    thumbnail: thumbnail
  })

  if (video) {
    const newVid = new Video(video)
    work.content.push(newVid._id)
    newVid.save()
  }

  work.save();

  res.status(201).json(work);
};

exports.getWorks = async (req, res) => {
  const { filters, skip, limit } = req.body
  try {
    const works = await Work.find(filters, ['name', 'medium', 'thumbnail', 'authors', 'public'], { sort: { _id: -1 } }).skip(skip).limit(limit).lean();
    const user = await User.findById(req.userId, ['role']).lean()

    for (let work of works) {
      if (!work.public && user.role == 'Guest') {
        work['locked'] = true
      }
      const authors = []

      for (let id of work.authors) {
        const user = await User.findById(id, ['name', 'avatar']).lean()
        authors.push(user)
      }
      work.authors = authors
    }

    res.status(200).json(works);
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

exports.getWork = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.userId, ['role']).lean()
  const canSeePrivate = ['Admin', 'Family member', 'Friend', 'Guest with access'].includes(user.role)

  if (!ObjectId.isValid(id)) { return res.status(404).send({ error: "Not Found" }) }

  try {
    const work = await Work.findById(id, ['name', 'date', 'public', 'thumbnail', 'description', 'content', 'medium', 'authors', 'user']).lean()

    let i = 0
    for (let photoId of work.content) {
      let photo = await Photo.findById(photoId, ['name', 'date', 'description', 'imagePath']).lean()
      if (!photo) {
        photo = await Video.findById(photoId).lean()
      }
      work.content[i] = photo
      i++
    }

    i = 0
    for (let userId of work.authors) {
      const user = await User.findById(userId, ['name', 'avatar']).lean()
      work.authors[i] = user
      i++
    }

    let info = {}
    info['pages'] = canSeePrivate ? await Work.countDocuments() : await Work.countDocuments({ public: true })
    info['position'] = await Work.countDocuments({ _id: { $lt: work._id } }) + 1

    if (info['pages'] > 1) {
      const nextColls = await Work.find({ _id: { $gt: work._id } }, ['_id']).sort({ _id: 1 })
      const prevColls = await Work.find({ _id: { $lt: work._id } }, ['_id']).sort({ _id: -1 })

      info['next'] = nextColls[0] ? nextColls[0]._id : prevColls[prevColls.length - 1]._id
      info['prev'] = prevColls[0] ? prevColls[0]._id : nextColls[nextColls.length - 1]._id
    } else {
      info['next'] = work._id
      info['prev'] = work._id
    }
    info['canEdit'] = !!work.authors.find(x => x._id == req.userId) || user.role == 'Admin'
    info['user'] = req.userId

    res.status(200).json({ work: work, info: info });
  } catch (error) {
    console.log(error);
    res.send({ error: "Something is wrong" });
  }
};

exports.deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id);
    const user = await User.findById(req.userId, ['role']).lean();

    if (!work) return res.status(404).json({ error: "work doesn't exists" });

    if (!work.authors.includes(req.userId) && user.role != 'Admin')
      return res.status(401).json({ error: 'this is not your work' });

    for (let picture of work.content) {
      const photo = await Photo.findById(picture)
      if (photo) {
        fs.unlink(path.resolve(photo.Ipath), (err) => {
          console.log(err)
        })
        photo.delete()
      } else {
        const video = await Video.findById(picture)

        video.delete()
      }
    }
    work.delete()


    return res.json({
      message: 'Successfully removed', work
    });
  } catch (error) {
    console.log(error);
    res.send('delete failed');
  }
};

exports.editWork = async (req, res) => {
  const { id, changes } = req.body;

  try {
    const work = await Work.findById(id);
    const user = await User.findById(req.userId, ['role']).lean()
    if (!work.authors.includes(req.userId) && user.role != 'Admin') {
      throw new Error('is not your work');
    }
    await Work.findByIdAndUpdate(id, changes);
    res.json({
      message: 'Successfully updated'
    });
  } catch (error) {
    console.log(error);
    res.send('edit failed');
  }
};

exports.addPic = async (req, res) => {
  const { id, pic } = req.body
  const work = await Work.findById(id, ['content'])

  work.content.push(pic)
  work.save()

  res.status(200).send({ message: 'OK' })
}

exports.delPic = async (req, res) => {
  const { id, index } = req.body
  const work = await Work.findById(id)

  if (work.content < 1) {
    work.delete()
  } else {
    work.content.splice(index, 1)
    work.save()
  }

  res.status(200).send({ message: 'OK' })
}

exports.addVideo = async (req, res) => {
  const { work, info } = req.body

  const parent = await Work.findById(work)
  const video = new Video(info)

  parent.content.push(video._id)

  parent.save()
  video.save()

  res.status(200).send(video)
}

exports.editVideo = async (req, res) => {
  const { id, video } = req.body

  delete video._id
  Video.findByIdAndUpdate(id, video, function (err, docs) {
    if (err) {
      print(err)
    } else {
      return res.status(200).send({ message: 'Updated' })
    }
  })
}

exports.deleteVideo = async (req, res) => {
  const { parent, id } = req.body

  const video = await Video.findById(id)
  const work = await Work.findById(parent)

  const index = work.content.findIndex(x => x == id)
  work.content.splice(index, 1)

  work.save()
  video.delete()
  res.status(200).send({ message: 'Done' })
}
