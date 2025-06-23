import { createTransport } from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

export const sendMail = async (to, subject, text) => {
    try {
        const transporter = createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false, 
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text,
            // html: "<b>Hello world?</b>",
        });

        console.log("Message sent:", info.messageId);
        return info
    }

    catch (error) {
        console.error("mail error ", error)
    }
}