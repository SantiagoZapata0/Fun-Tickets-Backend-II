import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
    }
});

export async function sendTicketConfirmEmail({to, eventTitle, quantity, reservationCode}){
    try{    
         transporter.sendMail({
            from: env.MAIL_FROM,
            to: to,
            subject: `Confirmacion de inscripcion: ${eventTitle}`,
            html: 
            `
                <h2>¡Tu inscripción fue confirmada!</h2>
                <p>Evento: <strong>${eventTitle}</strong></p>
                <p>Cantidad de entradas: <strong>${quantity}</strong></p>
                <p>Código de reserva: <strong>${reservationCode}</strong></p>
            `
        })
    } catch(err){
        console.error(`Error al enviar el email: ${err.message}`)
    }
}