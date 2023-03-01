const { Schema, model } = require('mongoose');

const requestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: { type: String, required: true },
    avatar: { type: String, required: true },
    type: { type: String, required: true },
    email: { type: String },
    item: { type: Object },
    purpose: { type: String, required: true },
    description: { type: String, default: null }
})

module.exports = model('AccessRequest', requestSchema, 'requests');