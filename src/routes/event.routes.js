import { Router } from "express";
import { createNewEvent, getEvents, getOneEvent, updateEvent } from "../controllers/event.controller.js";
import { authRoles, validateAdminOrOwner } from "../middlewares/auth.middleware.js";
import { passportError } from "../middlewares/passport.middleware.js"

const router = Router();

router.get("/", getEvents);
router.get("/:eid", getOneEvent);

router.post("/", passportError("jwt") , authRoles(['admin', 'organizer']), createNewEvent)

router.put("/:eid", passportError("jwt"), validateAdminOrOwner, updateEvent)

export default router;  