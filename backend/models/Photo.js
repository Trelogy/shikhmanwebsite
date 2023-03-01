const { Schema, model } = require('mongoose');

const photoSchema = new Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required: true },
  Ipath: { type: String },
  date: { type: String, required: false },
  description: { type: String },
  uploaded: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = model('Photo', photoSchema);
