import { Common } from "./common.dao.js";
import { ticketModel } from "../models/ticket.model.js";

class TicketDao extends Common{
    constructor(){
        super(ticketModel)
    }

    async getNotCancelledTickets(eventId){
        try{
            const tickets = await this.model.find({event: eventId, status: {$ne: "cancelled"}}); // $ne: not equal
            const totalTickets = tickets.reduce((acc, tick) => acc + tick.quantity, 0);
            return totalTickets
        } catch(err){
            throw err
        }
    }

    async getTicketById(ticketId){
        return await ticketDao.getById(ticketId);
    }

    async getActiveTicketsByUser(eventId, userId){
        try{
            const tickets = await this.model.findOne({event: eventId, user: userId, status: {$ne: "cancelled"}})
            return tickets;
        } catch(err){
            throw err
        }
    }

    async getMyTickets(userId){
        try{
            const tickets = await this.model.find({user: userId}).populate("event", "title date location");
            return tickets;
        } catch(err){
            throw err
        }
    }

    async getTicketsByEvent(eventId){
        try{
            const tickets = await this.model.find({event: eventId});
            return tickets;
        } catch(err){
            throw err
        }
    }

    async purchaseTicket(ticketData){
        try{
            const result = await this.model.create(ticketData)
            return result;
        } catch(err){
            throw err
        }
    }
}

export const ticketDao = new TicketDao();