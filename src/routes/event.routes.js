import { Router } from "express";
import { createNewEvent, getEvents, getOneEvent, updateEvent, changeEventStatus } from "../controllers/event.controller.js";
import { authRoles, validateAdminOrOwner } from "../middlewares/auth.middleware.js";
import { passportError } from "../middlewares/passport.middleware.js"

const router = Router();

router.get("/", getEvents);
router.get("/:eid", getOneEvent);

router.post("/", passportError("jwt") , authRoles(['admin', 'organizer']), createNewEvent)

router.put("/:eid", passportError("jwt"), validateAdminOrOwner, updateEvent)

router.patch("/:eid/status", passportError("jwt"), validateAdminOrOwner, changeEventStatus)

export default router;  