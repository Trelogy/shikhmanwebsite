const { Schema, model } = require('mongoose')

const itemSchema = new Schema({
    coll: {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
        required: true
    },
    type: { type: String, required: true },
    parent: { type: String, required: true },
    name: { type: String },
    date: { type: String },
    description: { type: String },
    medium: { type: String },
    thumbnail: { type: String },
    content: { type: Array, required: true },
    isThumbnail: { type: Boolean, default: false }
})

module.exports = model('Item', itemSchema, 'collectionitems')