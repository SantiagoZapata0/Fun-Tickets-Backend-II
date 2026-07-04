import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export async function userExists(req, res, next){
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (user == null) return res.status(401).json({ error: "El usuario no existe" });
        req.user = user;
        next();
    } catch(err) {
        next(err);
    }
}

export async function validToken(req, res, next){
    try{
        const token = jwt.verify(req.query.token, env.JWT_SECRET)
        return req.userJWT = token;

        next()
    } catch(err){
        return res.status(401).json({status: "Failed", payload: "Token inválido o expirado"})
    }
}