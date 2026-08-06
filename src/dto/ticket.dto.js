class TicketDTO{
    constructor(ticket, {includeEvent = false, includeUser = false} = {}){
        this.id = ticket._id; 
        this.quantity = ticket.quantity;
        this.status = ticket.status;
        this.reservationCode = ticket.reservationCode;
        this.createdAt = ticket.createdAt;
        this.cancelledAt = ticket.cancelledAt;

        if(includeEvent && ticket.event){
            this.event = {
                id: ticket.event._id,
                title: ticket.event.title,
                date: ticket.event.date,
                location: ticket.event.location
            }
        } else{
            this.event = ticket.event
        }

        if(includeUser && ticket.user){
            this.user = {
                id: ticket.user._id,
                first_name: ticket.user.first_name,
                email: ticket.user.email
            }
        } else{
            this.user = ticket.user?._id ?? ticket.user
        }
    }   
}

export default TicketDTO;