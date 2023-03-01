const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, required: true, unique: true, trim: true },
    avatar: { type: String, required: true },
    password: { type: String, trim: true },
    role: { type: String, required: true },
    category: { type: String, trim: true },
    description: { type: String },
    banned: { type: String, default: "" },
    google: { type: String, default: "" },
    socialMedia: { type: Array, default: [] },
    banner: { type: String, default: "" }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
        next();
    } catch (error) {
        console.log(error)
        throw new Error('Password encoding error');
    }
});

userSchema.methods.comparePassword = async function (canditePassword) {
    return await bcrypt.compare(canditePassword, this.password);
};

module.exports = model('User', userSchema, 'users');