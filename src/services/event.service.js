import { eventRepository } from "../repositories/event.repository.js";
import { userRepository } from "../repositories/user.repository.js";

export async function createEvent({title, description, date, place, capacity, price, status, organizer}){
    
    const existingEvent = await eventRepository.getEventByTitle(title)
    if(existingEvent){
        const error = new Error("Credenciales invalidas.")
        error.status = 409;
        throw error;
    }
    
    const event = await eventRepository.createEvent({title, description, date, place, capacity, price, status, organizer})

    return {
        title: event.title,
        description: event.description,
        date: event.date,
        place: event.place,
        capacity: event.capacity,
        price: event.price,
        status: event.status,
        organizer: event.organizer
    }
}

export async function getAllEvents() {
    const events = await eventRepository.getAllEvents();
    return events.map(e => ({
        id: e._id,
        title: e.title,
        description: e.description,
        date: e.date,
        place: e.place,
        capacity: e.capacity,
        price: e.price,
        status: e.status
    }));
}

export async function getEventById(id){
    const event = await eventRepository.getEventById(id)
    if(!event){
        const error = new Error("Credenciales invalidas.");
        error.status = 404;
        throw error;
    }

    return {
        title: event.title,
        description: event.description,
        date: event.date,
        place: event.place,
        capacity: event.capacity,
        price: event.price,
        status: event.status
    }
}

export async function updateOneEvent(id, data){

    const updatedEvent = await eventRepository.updateEvent(id, data)

    if(!updatedEvent){
        const error = new Error("El evento no existe");
        error.status = 404;
        throw error;
    }

    return {
        id: updatedEvent._id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        date: updatedEvent.date,
        place: updatedEvent.place,
        capacity: updatedEvent.capacity,
        price: updatedEvent.price,
        status: updatedEvent.status,
        organizer: updatedEvent.organizer
    }
}