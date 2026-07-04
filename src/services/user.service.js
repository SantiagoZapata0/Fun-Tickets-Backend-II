import { userRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/utils.js"
import { env } from "../config/env.js"
import jwt from "jsonwebtoken";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser({first_name, last_name, email, password}){

    if(!first_name || !last_name || !email || !password) {
        const error = new Error("Todos los campos son obligatorios");
        error.status = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if(!emailRegex.test(normalizedEmail)){
        const error = new Error("Formato de email invalido.");
        error.status = 400;
        throw error;
    }

    if(password.length < 6){
        const error = new Error("La contraseña debe contener al menos 6 caracteres.");
        error.status = 400;
        throw error;
    }

    const existingUser = await userRepository.getUserByEmail(normalizedEmail)

    if(existingUser){
        const error = new Error("El usuario ya existe");
        error.status = 409;
        throw error;
    }

    const hashedPassword = await createHash(password)
    const newUser = await userRepository.createUser({first_name, last_name, email: normalizedEmail, password: hashedPassword});

    return {
        id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role
    }
        
}

export async function loginUser({email, password}){

    const normalizedEmail = email.trim().toLowerCase()
    const user = await userRepository.getUserByEmail(normalizedEmail)

    if(!email || !password){
        const error = new Error("Todos los campos son obligatorios.");
        error.status = 400;
        throw error;
    }

    if(!user){
        const error = new Error("Este usuario no esta registrado, por favor, registrate.");
        error.status = 404;
        throw error;
    }

    if(await isValidPassword(password, user.password)){
        const sessionData = {
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(sessionData, env.JWT_SECRET, {expiresIn: env.EXPIRES_IN});

        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            token: token
        }

        } else{
            const error = new Error("Credenciales invalidas.");
            error.status = 409;
            throw error;
        }
}

export async function getAllUsers(){
    const users = await userRepository.getAllUsers();
    return users.map(u => ({
        id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        role: u.role
    }))
}