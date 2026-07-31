import { Common } from "./common.dao.js";
import { ticketModel } from "../models/ticket.model.js";

class TicketDao extends Common{
    constructor(){
        super(ticketModel)
    }

    async createTicket(ticketData){
        try{
            const result = await this.model.create(ticketData)
            return result;
        } catch(err){
            throw err
        }
    }
}

export const ticketDao = new TicketDao();