import { Router } from "express";

import { passportError } from "../middlewares/passport.middleware.js";
import { getMyTickets, cancelTicketController } from "../controllers/ticket.controller.js"; 

const router = Router();

router.get("/my-tickets", passportError("jwt"), getMyTickets);

router.patch("/:tid/cancel", passportError("jwt"), cancelTicketController);

export default router