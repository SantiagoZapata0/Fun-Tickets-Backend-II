import { eventRepository } from "../repositories/event.repository.js"

export function authRoles(roles = []){ // Tu rol te permite hacer esta accion?
    return async function(req, res, next){
        try{
            if(!req.user){
                return res.status(401).json({status: "Failed", message: "No autenticado"})
            }

            if(!roles.includes(req.user.role)){
                return res.status(403).json({status: "Failed", message: "No autorizado"})
            }
            next()
        } catch(err){
            return res.status(err.status || 500).json({status: "Failed", message: err.message})
        }
    }
}

export async function validateAdminOrOwner(req, res, next){ // Vos podes tocar este evento en particular?
    try{
        const event = await eventRepository.getEventById(req.params.eid);
        
        if(event == null){
            return res.status(404).json({status: "Failed", message: "Evento inexistente."})
        }
        
        if(req.user.role == "admin"){
            return next()
        } 
        
        if(req.user.role === "organizer" && event.organizer.toString() === req.user.id.toString()){ // Si tu rol es "organizer" y si tu id coincide con la del organizador, pasa.
            return next()
        }
            
        return res.status(403).json({status: "Failed", message: "No tenes permiso para modificar este evento."})

    } catch(err){
        return res.status(500).json({status: "Failed", message: err.message})
    }
}