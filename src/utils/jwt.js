import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(data){
    return jwt.sign(data, env.JWT_SECRET, {expiresIn: env.JWT_EXPIRES_IN});
}

export function verifyToken(token){
    return jwt.verify(token, env.JWT_SECRET);
}