import { eventRepository } from "../repositories/event.repository.js";
import { categoryRepository } from "../repositories/category.repository.js";
import { ticketRepository } from "../repositories/ticket.repository.js";
import EventDTO from "../dto/event.dto.js";
import TicketDTO from "../dto/ticket.dto.js";

export async function createEvent({title, description, category, date, location, capacity, price, status, organizer}){

    if(!title || !description || !category || !location){
        const error = new Error("Todos los campos son obligatorios.");
        error.status = 400;
        throw error;
    }

    const existingCategory = await categoryRepository.getCategoryById(category);

    if(!existingCategory){
        const error = new Error("Categoria inexistente.");
        error.status = 404;
        throw error;
    }

    if(capacity <= 0){
        const error = new Error("La capacidad debe ser mayor a 0.");
        error.status = 400;
        throw error;
    }

    if(price < 0){
        const error = new Error("El precio no puede ser negativo.");
        error.status = 400;
        throw error;
    }

    const eventDate = new Date(date)
    const nowDate = new Date();

    if(eventDate < nowDate){
        const error = new Error("No se puede crear un evento con una fecha pasada.");
        error.status = 400;
        throw error;
    }
    
    const existingEvent = await eventRepository.getEventByTitle(title)
    if(existingEvent){
        const error = new Error("El evento ya existe.")
        error.status = 409;
        throw error;
    }
    
    const event = await eventRepository.createEvent({title, description, category, date, location, capacity, price, organizer})

    return new EventDTO(event)
}

export async function getAllEvents(queryParams) {

    const { status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort} = queryParams;

    const filter = {}

    if(status) filter.status = status;
    if(category) filter.category = category;
    if(location) filter.location = location;

    if(dateFrom || dateTo){
        filter.date = {};
        if(dateFrom) filter.date.$gte = new Date(dateFrom);
        if(dateTo) filter.date.$lte = new Date(dateTo);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortOption = sort ? sort : "date"

    const { events, total } = await eventRepository.getFilteredEvents(filter, {skip, limit: limitNum, sort: sortOption});
    return {
        data: 
            events.map(event => new EventDTO(event)),
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total/limitNum)
    };
}

export async function updateEventStatus(id, newStatus){
    const validStatuses = ["draft", "published", "cancelled", "finished"]

    if(!validStatuses.includes(newStatus)){
        const error = new Error("Estado invalido.");
        error.status = 400;
        throw error;
    }

    const event = await eventRepository.getEventById(id)

    if(!event){
        const error = new Error("El evento no existe.")
        error.status = 404;
        throw error;
    }

    if(event.status === "cancelled"){
        const error = new Error("No se puede modificar un evento cancelado.");
        error.status = 400;
        throw error;
    }

    if(newStatus === "published" && (event.status === "finished" || event.status === "cancelled")){
        const error = new Error("No se puede publicar un evento cancelado o finalizado.")
        error.status = 400;
        throw error;
    }

    const updatedEvent = await eventRepository.updateEvent(id, {status: newStatus});

    return new EventDTO(updatedEvent);
}

export async function getEventById(id){
    const event = await eventRepository.getEventById(id)

    if(!event){
        const error = new Error("El evento no existe.");
        error.status = 404;
        throw error;
    }

    return new EventDTO(event);
}

export async function getEventTicketsList(eventId){
    const tickets = await ticketRepository.getEventTickets(eventId);
    return tickets.map(tick => new TicketDTO(tick));
}

export async function updateOneEvent(id, data){

   const existingEvent = await eventRepository.getEventById(id);

    if(!existingEvent){
        const error = new Error("El evento no existe.");
        error.status = 404;
        throw error;
    }

    if(existingEvent.status === "cancelled"){
        const error = new Error("No se puede modificar un evento cancelado.");
        error.status = 400;
        throw error;
    }

    if(data.capacity <= 0){
        const error = new Error("La capacidad debe ser mayor a 0.");
        error.status = 400;
        throw error;
    }

    if(data.price < 0){
        const error = new Error("El precio no puede ser negativo.");
        error.status = 400;
        throw error;
    }

   if(data.date !== undefined && new Date(data.date) < new Date()){
        const error = new Error("No se puede actualizar a una fecha pasada");
        error.status = 400;
        throw error;
   }

    const updatedEvent = await eventRepository.updateEvent(id, data)

    return new EventDTO(updatedEvent)
}