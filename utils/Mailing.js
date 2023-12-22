var nodemailer = require("nodemailer");

function enviarMail(para, asunto, mensaje) {
  var smtpTransport = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    auth: {
      user: "farm-erp@outlook.com",
      pass: "Password@1!",
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  var mailOptions = {
    from: "farm-erp@outlook.com",
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
