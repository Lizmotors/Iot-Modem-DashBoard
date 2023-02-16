const nodemailer = require('nodemailer');
const sibTransport = require('nodemailer-sendinblue-transport');

const env = require('../env');

console.log(env);

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    secure: true,
    port: 465,
    auth: {
        user: env.MAILER_EMAIL,
        pass: env.MAILER_PASSWORD,
    },
    // service: 'SendinBlue', // no need to set host or port etc.
    // secure: true,
    // host: 'smtp-relay.sendinblue.com',
    // port: 587,
    // auth: {
    //     user: env.MAILER_EMAIL,
    //     pass: env.MAILER_PASSWORD,
    // },
});

// const transporter = nodemailer.createTransport(
//     sibTransport({
//         apiKey: env.MAILER_PASSWORD,
//     })
// );

const sendMail = async ({ toAddress = '', body = '', subject = 'Test', attachments = [] }) => {
    if (!toAddress) {
        throw new Error('need target to address to send mail');
    }
    const result = await transporter.sendMail({
        from: env.MAILER_EMAIL, // sender address
        to: toAddress, // list of receivers
        subject, // Subject line
        html: body, // html body
        attachments,
    });

    return result;
};

module.exports = sendMail;
