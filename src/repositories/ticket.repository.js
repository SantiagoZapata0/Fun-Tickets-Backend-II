import { ticketDao } from "../dao/ticket.dao.js";

export class TicketRepository{
    async getActiveTickets(eventId){
        return await ticketDao.getNotCancelledTickets(eventId);
    }

    async getActiveTicksByUser(eventId, userId){
        return await ticketDao.getActiveTicketsByUser(eventId, userId);
    }

    async getUserTickets(userId){
        return await ticketDao.getMyTickets(userId);
    }

    async getEventTickets(eventId){
        return await ticketDao.getTicketsByEvent(eventId);
    }

    async purchaseTickets(ticketData){
        return await ticketDao.purchaseTicket(ticketData);
    }

    async getTickById(ticketId){
        return await ticketDao.getTicketById(ticketId)
    }

    async updateTicket(ticketId, ticketData){
        return await ticketDao.update(ticketId, ticketData);
    }
}

export const ticketRepository = new TicketRepository();