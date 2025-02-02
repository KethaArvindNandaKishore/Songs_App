const nodemailer = require("nodemailer");
const email = process.env.EMAIL;
const password = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",  
  port: 465,
  auth: {
    user: email,  
    pass: password,  
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error connecting to the SMTP server: ", error);
  } else {
    console.log("SMTP server is ready to send emails.");
  }
});

module.exports = transporter;