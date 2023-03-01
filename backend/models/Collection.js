const { Schema, model } = require('mongoose')

const collSchema = new Schema({
    name: { type: String },
    started: { type: String },
    finished: { type: String },
    description: { type: String },
    public: { type: Boolean },
    content: { type: Array },
    authors: { type: Array, required: true },
    thumbnails: { type: Array }
})

module.exports = model('Collection', collSchema, 'collections')