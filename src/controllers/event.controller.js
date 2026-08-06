import { transporter } from "../config/nodemailer.js";
import { getEventById, createEvent, getAllEvents, updateOneEvent, updateEventStatus, getEventTicketsList } from "../services/event.service.js";

export async function getOneEvent(req, res, next){
  try{
    const event = await getEventById(req.params.id)
    return res.status(200).json({status: "Success", payload: event})
  } catch(err){
    return res.status(err.status || 500).json({status: "Failed", message: err.message})
  }
}

export async function getEvents(req, res, next){
  try{
    const events = await getAllEvents(req.query)
    return res.status(200).json({status: "Success", payload: events})
  } catch(err){
    return res.status(err.status || 500).json({status: "Failed", message: err.message})
  }
}

export async function getEventTickets(req, res, next){
    try{
        const { eid } = req.params;
        const tickets = await getEventTicketsList(eid);
        return res.status(200).json({status: "Success", payload: tickets});
    } catch(err){
        return res.status(err.status || 500).json({status: "Failed", message: err.message});
    }
}

export async function createNewEvent(req, res, next){
  try{
    const eventData = {...req.body, organizer: req.user.id}
    const newEvent = await createEvent(eventData);
    return res.status(201).json({status: "Success", payload: newEvent})
  } catch(err){
    return res.status(err.status || 500).json({status: "Failed", message: err.message})
  }
}

export async function updateEvent(req, res, next){
  try{
    const id = req.params.eid;
    const { title, description, date, place, capacity, price, status } = req.body;
    const eventUpdated = await updateOneEvent(id, { title, description, date, place, capacity, price, status });
    return res.status(200).json({status: "Success", payload: eventUpdated})
  } catch(err){
    return res.status(err.status || 500).json({status: "Failed", message: err.message})
  }
}

export async function changeEventStatus(req, res, next){
  try{
    const { eid } = req.params;
    const { status } = req.body;
    const updatedEvent = await updateEventStatus(eid, status);
    return res.status(200).json({status: "Success", payload: updatedEvent});
  } catch(err){
    return res.status(err.status || 500).json({status: "Failed", message: err.message})
  }
}