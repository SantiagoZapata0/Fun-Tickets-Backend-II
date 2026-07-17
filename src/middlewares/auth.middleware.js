import { eventRepository } from "../repositories/event.repository.js"
import { userRepository } from "../repositories/user.repository.js"

export function authRoles(roles = []){
    return async function(req, res, next){
        try{
            if(!roles.includes(req.user.role)){
                return res.status(403).json({status: "Failed", payload: "No autorizado"})
            }
            next()
        } catch(err){
            return res.status(err.status || 500).json({status: "Failed", payload: err.message})
        }
    }
}

export async function validateAdminOrOwner(req, res, next){
    try{
        const event = await eventRepository.getEventById(req.params.eid);
        const user = await userRepository.getUserByEmail(req.user.email)
        
        if(event == null){
            return res.status(404).json({status: "Failed", payload: "Evento inexistente."})
        }

        if(user == null){
            return res.status(404).json({status: "Failed", payload: "Sesion no iniciada."})
        }
        
        if(user.role == "admin"){
            next()
        } else if(user.role === "organizer" && event.organizer.toString() === user.id.toString()){
            next()
        } else{
            return res.status(403).json({status: "Failed", payload: err.message})
        }
    } catch(err){
        return res.status(500).json({status: "Failed", payload: err.message})
    }
}