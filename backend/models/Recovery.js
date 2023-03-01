const { Schema, model } = require('mongoose')

const passwordSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: { type: Date, default: Date.now }
})

module.exports = model('Recovery', passwordSchema, 'passwordRecovery')