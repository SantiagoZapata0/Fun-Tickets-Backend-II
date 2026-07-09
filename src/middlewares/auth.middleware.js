import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { verifyToken } from "../utils/jwt.js";

export async function validToken(req, res, next){
    try{
        const { currentUser } = req.cookies; 
        const token = verifyToken(currentUser)
        req.user = token
        next()
    } catch(err){
        return res.status(401).json({status: "Failed", payload: err.message})
    }
}