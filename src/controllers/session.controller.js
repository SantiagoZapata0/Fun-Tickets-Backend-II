import { loginUser, registerUser } from "../services/user.service.js";

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
        const user = await loginUser(req.body);
        res.status(200).json({status: "Success", payload: user})
    } catch(err){
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function currentUser(req, res, next){
    try{
        res.status(200).json({data: req.userJWT}) 
    } catch(err){
        res.status(err.status || 500).json({error: err})
    }
}