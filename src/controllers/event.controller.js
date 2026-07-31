import { transporter } from "../config/nodemailer.js";
import { getEventById, createEvent, getAllEvents, updateOneEvent, updateEventStatus } from "../services/event.service.js";

export async function getOneEvent(req, res, next){
  try{
    const event = await getEventById(req.params.id)
    res.status(200).json({status: "Success", payload: event})
  } catch(err){
    res.status(err.status || 500).json({status: "Failed", payload: err.message})
  }
}

export async function getEvents(req, res, next){
  try{

    transporter.sendMail({
      from: "mollie7@ethereal.email",
      to: "mollie7@ethereal.email",
      subject: "Nodemailer - test",
      html: "<h1>Hola nodemailer</h1>"
    })
    const events = await getAllEvents(req.query)
    res.status(200).json({status: "Success", payload: events})
  } catch(err){
    res.status(err.status || 500).json({status: "Failed", payload: err.message})
  }
}

export async function createNewEvent(req, res, next){
  try{
    const eventData = {...req.body, organizer: req.user.id}
    const newEvent = await createEvent(eventData);
    res.status(201).json({status: "Success", payload: newEvent})
  } catch(err){
    res.status(err.status || 500).json({status: "Failed", payload: err.message})
  }
}

export async function updateEvent(req, res, next){
  try{
    const id = req.params.eid;
    const { title, description, date, place, capacity, price, status } = req.body;
    const eventUpdated = await updateOneEvent(id, { title, description, date, place, capacity, price, status });
    return res.status(200).json({status: "Success", payload: eventUpdated})
  } catch(err){
    return res.status(err.status || 500).json({status: "Failed", payload: err.message})
  }
}

export async function changeEventStatus(req, res, next){
  try{
    const { eid } = req.params;
    const { status } = req.body;
    const updatedEvent = await updateEventStatus(eid, status);
    return res.status(200).json({status: "Success", payload: updatedEvent});
  } catch(err){
    return res.status(err.status || 500).json({status: "Failed", payload: err.message})
  }
}