import { eventDao } from "../dao/event.dao.js"

export class EventRepository{
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
}

export const eventRepository = new EventRepository();