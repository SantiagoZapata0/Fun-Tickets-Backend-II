import { Router } from "express";
import { createNewEvent, getEvents, getOneEvent, updateEvent, changeEventStatus, getEventTickets } from "../controllers/event.controller.js";
import { purchaseTickets } from "../controllers/ticket.controller.js";
import { authRoles, validateAdminOrOwner } from "../middlewares/auth.middleware.js";
import { passportError } from "../middlewares/passport.middleware.js"

const router = Router();

router.get("/", getEvents);
router.get("/:eid", getOneEvent);
router.get("/:eid/tickets", passportError("jwt"), validateAdminOrOwner, getEventTickets)

router.post("/", passportError("jwt") , authRoles(['admin', 'organizer']), createNewEvent)
router.post("/:eid/tickets", passportError("jwt"), purchaseTickets);

router.put("/:eid", passportError("jwt"), validateAdminOrOwner, updateEvent)

router.patch("/:eid/status", passportError("jwt"), validateAdminOrOwner, changeEventStatus)

export default router;  