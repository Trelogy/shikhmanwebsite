const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
    name: {type: String, required: true},
    thumbnail: {type: Object, required: true},
    date: {type: String},
    videoID: {type: String, required: true},
    description: {type: String}
})

module.exports = model('Video', videoSchema, 'videos');