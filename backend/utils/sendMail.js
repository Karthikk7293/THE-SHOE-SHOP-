const nodemailer = require("nodemailer")

const sendMail = async (options)=>{



    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL ,// generated ethereal user
           pass: process.env.SMPT_PASSWORD // generated ethereal password

        }
    });

console.log(options.email);
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }


    await transporter.sendMail(mailOptions);

};


module.exports = sendMail;