import { Router } from "express";
import { register, login, currentUser } from "../controllers/session.controller.js";
import { userExists } from "../middlewares/session.middleware.js";
import { validToken } from "../middlewares/session.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", userExists, login);
router.get("/current", validToken, currentUser);

export default router