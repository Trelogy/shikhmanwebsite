const Photo = require('../models/Photo');
const usersRoutes = require('../routes/usersindex');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.userId });
    res.status(200).json({ photos });
  } catch (error) {
    console.log(error);
    res.send({error: error});
  }
};

exports.postPhoto = async (req, res) => {
  const { name, date, description } = req.body;
  const imagePath = 'http://localhost:4000/images/' + req.file.filename; // Note: set path dynamically
  
  const photo = new Photo({
    name: name,
    imagePath: imagePath,
    Ipath: req.file.path,
    date: date, 
    description: description,
    user: req.userId,
  });
  const createdPhoto = await photo.save();
  res.status(201).json({
    photo: {
      ...createdPhoto._doc,
    },
  });
};

exports.getPhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const photo = await Photo.findById(id);
    if (!photo.user.equals(req.userId)) {
      throw new Error('is not your photo');
    }
    res.status(200).json({ photo });
  } catch (error) {
    console.log(error);
    res.send({error: "Something is wrong"});
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);

    if(!photo) return res.status(404).json({ error: 'photo doesnt exists'});

    if (!photo.user.equals(req.userId)) 
    return res.status(401).json({ error: 'this is not your photo'});

    await photo.remove();
    if(photo) {
      fs.unlink(path.resolve(photo.Ipath), (err) => {
        console.log(err)
      });
    }
    return res.json({
      message: 'Successfully removed'
    });
  } catch (error) {
    console.log(error);
    res.send({ error: 'delete failed'});
  }
};

exports.editPhoto = async (req, res) => {
  const { id } = req.params;
  const { name, date, description } = req.body;
  try {
    const photo = await Photo.findById(id);
    if (!photo.user.equals(req.userId)) {
      throw new Error('is not your photo');
    }
    await photo.updateOne({name, date, description});
    res.json({
      message: 'Successfully updated', photo
    });
  } catch (error) {
    console.log(error);
    res.send('edit failed');
  }
};