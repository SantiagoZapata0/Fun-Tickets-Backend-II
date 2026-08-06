import { getAllUsers } from "../services/user.service.js";

export async function getUsers(req, res, next){
    try{
        const users = await getAllUsers();
        return res.status(200).json({status: "Success", payload: users})
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message})
    }
}