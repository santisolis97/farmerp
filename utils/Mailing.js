var nodemailer = require('nodemailer');

function enviarMail(para, asunto, mensaje) {
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'farmerp.utn.frre@gmail.com',
            pass: 'farmerp1234'
        }
    });

    var mailOptions = {
        from: '"FarmERP - UTN FRRe" <farmerp.utn.frre@gmail.com>',
        to: para,
        subject: asunto,
        text: mensaje
    };

    smtpTransport.sendMail(mailOptions);

    if (process.env.NODE_ENV != 'test') {
        console.log('Mail enviado a ' + para + ', asunto: ' + asunto);
    }
}

module.exports = {
    enviarMail
}