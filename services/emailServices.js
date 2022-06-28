const nodemailer = require('nodemailer');

async function sendMail({from, to ,text , subject ,html }){
    let transporter = nodemailer.createTransport({
        host : process.env.SMTP_HOST_SERVER,
        port : process.env.SMTP_PORT,
        secure : false,
        auth : {user : process.env.MAIL_USER , pass:process.env.MAIL_PASSWORD },

    });

    let info = await transporter.sendMail({
        from : `From Automated Mail service FShare FROM : ${from}`,
        to : to,
        text : text,
        subject : subject,
        html: html,
    });

}

module.exports = sendMail;