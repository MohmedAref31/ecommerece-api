const nodemailer = require("nodemailer");


exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

 await transporter.sendMail({
    from: "Mohamed Aref",
    to:options.reciever,
    subject: options.subject,
    html: options.html
  })
};
