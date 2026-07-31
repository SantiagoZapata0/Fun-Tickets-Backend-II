import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mollie7@ethereal.email',
        pass: 'SV6rJed2Fn9ntn9zCf'
    }
});