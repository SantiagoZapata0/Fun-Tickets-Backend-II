import { ticketRepository } from "../repositories/ticket.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { eventRepository } from "../repositories/event.repository.js"
import { generateReservationCode } from "../utils/utils.js";
import { sendTicketConfirmEmail } from "../config/nodemailer.js";

export async function purchaseTicket({ user, email, event, quantity }){

    if(!event || !user){
        const error = new Error ("Faltan campos requeridos.")
        error.status = 400;
        throw error
    }

    if(!quantity || quantity <= 0){
        const error = new Error("La cantidad indicada es invalida.");
        error.status = 400;
        throw error;
    }

    const eventFound = await eventRepository.getEventById(event)

    if(!eventFound){
        const error = new Error("El evento indicado no existe.")
        error.status = 404;
        throw error
    }

    if(eventFound.status !== "published"){
        const error = new Error("El evento no esta publicado.");
        error.status = 400;
        throw error;
    }

    const userHasTicket = await ticketRepository.getActiveTicksByUser(event, user);

    if(userHasTicket){
        const error = new Error("El usuario ya se encuentra suscrito a este evento.");
        error.status = 400;
        throw error;
    }

    const activeTickets = await ticketRepository.getActiveTickets(event);
    const availableTickets = eventFound.capacity - activeTickets 

    if(quantity > availableTickets){
        const error = new Error("No hay suficientes tickets disponibles.");
        error.status = 400;
        throw error;
    }

    const code = generateReservationCode()

    const newTicket = await ticketRepository.purchaseTickets({user, event, quantity, reservationCode: code});

    await sendTicketConfirmEmail({
        to: email,
        eventTitle: eventFound.title,
        quantity: newTicket.quantity,
        reservationCode: newTicket.reservationCode
    });

    return{
        id: newTicket._id,
        user: newTicket.user,
        event: newTicket.event,
        quantity: newTicket.quantity,
        status: newTicket.status,
        reservationCode: newTicket.reservationCode
    }
}

export async function getUserTicketsList(userId){
    const tickets = await ticketRepository.getUserTickets(userId);
    return tickets.map(tick => ({
        id: tick._id,
        event: tick.event, 
        quantity: tick.quantity,
        status: tick.status,
        reservationCode: tick.reservationCode,
        createdAt: tick.createdAt,
        cancelledAt: tick.cancelledAt
    }));
}

export async function cancelTicket(ticketId, userId, role){

    const ticket = await ticketRepository.getTickById(ticketId);

    if(!ticket){
        const error = new Error("El ticket no existe.");
        error.status = 404;
        throw error;
    }

    if(ticket.status === "cancelled"){
        const error = new Error("Ticket ya cancelado.");
        error.status = 400;
        throw error;
    }

    if(ticket.user.toString() !== userId && role !== "admin"){
        const error = new Error("No puedes modificar este ticket.");
        error.status = 403;
        throw error;
    };

    const cancelledTicket = await ticketRepository.updateTicket(ticketId, {status: "cancelled", cancelledAt: new Date()})

    return {
        id: cancelledTicket._id,
        event: cancelledTicket.event, 
        quantity: cancelledTicket.quantity,
        status: cancelledTicket.status,
        reservationCode: cancelledTicket.reservationCode,
        createdAt: cancelledTicket.createdAt,
        cancelledAt: cancelledTicket.cancelledAt
    }
}