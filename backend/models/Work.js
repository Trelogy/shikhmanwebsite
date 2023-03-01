const { Schema, model } = require('mongoose');

const workSchema = new Schema({
    name: { type: String },
    date: { type: String },
    description: { type: String },
    socialm: { type: String },
    medium: { type: String },
    public: { type: Boolean, required: true, default: false },
    content: [{
        type: Schema.Types.ObjectId,
        ref: "Photo",
        required: true,
    }],
    authors: { type: Array, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    thumbnail: { type: Object }
});

module.exports = model('Work', workSchema, 'works');