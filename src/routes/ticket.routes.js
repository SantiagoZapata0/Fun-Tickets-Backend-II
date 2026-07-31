import { Router } from "express";
import { getTickets, createNewTicket, getMyTickets, getTicketById, cancelTicket } from "../controllers/ticket.controller.js";
import { passportError } from "../middlewares/passport.middleware.js" 
import { authRoles } from "../middlewares/auth.middleware.js"

const router = Router();

router.get("/", passportError("jwt"), authRoles(["admin", "organizer"]), getTickets);
router.get("/:tid", passportError("jwt"), getTicketById); // Debe ser el dueño del ticket (middleware)
router.get("/my-tickets", passportError("jwt"), getMyTickets)

router.post("/", passportError("jwt"), createNewTicket);

router.patch("/:tid/:eid", passportError("jwt"), cancelTicket)

export default router