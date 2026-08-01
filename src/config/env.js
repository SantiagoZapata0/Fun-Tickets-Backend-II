import dotenv from "dotenv";

dotenv.config();

export const env = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    MAIL_HOST: process.env.MAIL_HOST, 
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER, 
    MAIL_PASS: process.env.MAIL_PASS, 
    MAIL_FROM: process.env.MAIL_FROM
}
