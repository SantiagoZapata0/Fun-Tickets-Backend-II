import { loginUser, registerUser } from "../services/user.service.js";
import { env } from "../config/env.js";

export async function register(req, res, next){
    try{
        const newUser = await registerUser(req.body);
        return res.status(201).json({status: "Success", message: "Usuario registrado correctamente.", payload: newUser})
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", payload: err.message})
    }
}

export async function login(req, res, next){
    try{
        const { first_name, last_name, email, role, token } = await loginUser(req.body);
        return res.cookie("currentUser", token, { secure: env.NODE_ENV === "production", sameSite: "lax", httpOnly: true, maxAge: 3600000 }).status(200).json({status: "Success", payload: {first_name, last_name, email, role}})
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", payload: err.message });
    }
}

export async function currentUser(req, res, next){
    try{
        const { id, email, role } = req.user
        return res.status(200).json({status: "Success", payload: {id, email, role}}) 
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", payload: err.message})
    }
}

export async function logout(req, res, next){
    try{
        res.clearCookie("currentUser");
        return res.status(200).json({status: "Success", payload: "Sesión cerrada correctamente."});
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", payload: err.message});
    }
}