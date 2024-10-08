var nodemailer = require("nodemailer");

function enviarMail(para, asunto, mensaje) {
  var smtpTransport = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "farm-erp@hotmail.com",
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: "farm-erp@hotmail.com",
    to: para,
    subject: asunto,
    text: mensaje,
  };

  try {
    smtpTransport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
  if (process.env.NODE_ENV != "test") {
    console.log("Mail enviado a " + para + ", asunto: " + asunto);
  }
}

module.exports = {
  enviarMail,
};
