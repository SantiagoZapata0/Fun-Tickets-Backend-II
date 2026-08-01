import { purchaseTicket, getUserTicketsList, cancelTicket } from "../services/ticket.service.js";

export async function purchaseTickets(req, res, next){
    try{
        const email = req.user.email;
        const user = req.user.id;
        const event = req.params.eid;
        const { quantity } = req.body
        const tickets = await purchaseTicket({user, email, event, quantity})
        return res.status(201).json({status: "Success", payload: tickets})
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message });
    }
}

export async function getMyTickets(req, res, next){
    try{
        const userId = req.user.id;
        const tickets = await getUserTicketsList(userId);
        return res.status(200).json({status: "Success", payload: tickets});
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message});
    }
}

export async function cancelTicketController(req, res, next){
    try{
        const { tid } = req.params;
        const userId = req.user.id;
        const role = req.user.role;
        const cancelledTicket = await cancelTicket(tid, userId, role);
        return res.status(200).json({status: "Success", payload: cancelledTicket});
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message});
    }
}