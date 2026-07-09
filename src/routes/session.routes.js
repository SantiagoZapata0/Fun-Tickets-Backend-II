import { Router } from "express";
import { register, login, currentUser, logout } from "../controllers/session.controller.js";
import { validToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current", validToken, currentUser);
router.post("/logout", logout)

export default router