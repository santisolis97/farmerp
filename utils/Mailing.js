var nodemailer = require('nodemailer');

function enviarMail(para, asunto, mensaje) {
    var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'farmerp.utn.frre@gmail.com',
            pass: 'dc37g2km4a5hqf'
        }
    });

    var mailOptions = {
        from: '"FarmERP - UTN FRRe" <farmerp.utn.frre@gmail.com>',
        to: para,
        subject: asunto,
        text: mensaje
    };

    try {
        smtpTransport.sendMail(mailOptions);
    } catch (error) {
        console.log(error)
    }

    if (process.env.NODE_ENV != 'test') {
        console.log('Mail enviado a ' + para + ', asunto: ' + asunto);
    }
}

module.exports = {
    enviarMail
}