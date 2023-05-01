const express = require('express');
const EmailController = express.Router();
var nodemailer = require('nodemailer');

// vsllxnnztqsrtwrq
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'enter your email here',
        pass: 'enter your email pass here'
    }
});

EmailController.post('/sendQuery', async(req, res) => {
    const data = req.body;
    var mailOptions = {
        from: data.email,
        to: 'hassanrai594@gmail.com',
        subject: 'Query from E-Predictor',
        text: data.message
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.send({ status: false, message: 'Email not sent', "error": err })
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ status: true, message: 'Email sent Successfully' });
        }
    });
})


module.exports = EmailController;