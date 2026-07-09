import dotenv from "dotenv";

dotenv.config();

export const env = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    COOKIE_SECRET: process.env.COOKIE_SECRET
}
