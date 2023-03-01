const nodemailer = require('nodemailer')

exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "shikhmansfamily@gmail.com",
      pass: "iiugmyzmzpctqufi"
    },
  });