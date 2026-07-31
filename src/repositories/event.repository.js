import { eventDao } from "../dao/event.dao.js"

class EventRepository{
    async getAllEvents(){
        return await eventDao.getAll();
    }

    async createEvent(eventData){
        return await eventDao.createEvent(eventData);
    }

    async getEventById(id){
        return await eventDao.getEventById(id);
    }

    async getEventByTitle(title){
        return await eventDao.getEventByTitle(title);
    }

    async updateEvent(id, eventData){
        return await eventDao.update(id, eventData);
    }

    async getFilteredEvents(filter, options){
        return await eventDao.getFiltered(filter, options)
    }
}

export const eventRepository = new EventRepository();