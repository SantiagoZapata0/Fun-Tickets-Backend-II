import { userRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js"
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";

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

    return new UserDTO(newUser);
}

export async function loginUser({email, password}){

    if(!email || !password){
        const error = new Error("Todos los campos son obligatorios.");
        error.status = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await userRepository.getUserByEmail(normalizedEmail)

    if(!user){
        const error = new Error("Credenciales invalidas.");
        error.status = 401;
        throw error;
    }

    if(await isValidPassword(password, user.password)){
        return new UserDTO({
            id: user._id, 
            email: user.email, 
            role: user.role,})
        } else{
            const error = new Error("Credenciales invalidas.");
            error.status = 401;
            throw error;
        }
}

export async function getAllUsers(){
    const users = await userRepository.getAllUsers();
    return users.map(user => new UserDTO(user))
}