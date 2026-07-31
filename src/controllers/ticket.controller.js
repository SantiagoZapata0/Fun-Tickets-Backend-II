import { getAllTickets, createTicket } from "../services/ticket.service.js";

export async function getTickets(req, res, next){
    try{
        const tickets = await getAllTickets()
        return res.status(200).json({status: "Success", payload: tickets})
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message });
    }
}

export async function getTicketById(req, res, next){
    try{

    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message });
    }
}

export async function getMyTickets(req, res, next){
    try{
        
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message });
    }
}

export async function createNewTicket(req, res, next){
    const {user, event} = req.body;
    try{
        const result = await createTicket({user, event})
        return res.status(201).json({status: "Success", payload: result})
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message})
    }
}

export async function cancelTicket(req, res, next){
    try{
        
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message });
    }
}