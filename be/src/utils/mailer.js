import nodemailer from "nodemailer";
import config from "../../config/default.js";
import * as dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL_USER,
        pass: process.env.AUTH_EMAIL_PASSWORD,
    }
})

// const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//         user: "alford.gaylord@ethereal.email",
//         pass: "kJ8AKDYsYxJWMSNa22",
//     }
// })

async function sendEmail(payload) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            return err;
        }

    });
}

export default sendEmail;