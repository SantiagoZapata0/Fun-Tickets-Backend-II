import { Router } from "express";
import { register, login, currentUser, logout } from "../controllers/session.controller.js";
import { passportError } from "../middlewares/passport.middleware.js";
import passport from "passport";

const router = Router();

router.post("/register", passportError("register"), register);
router.post("/login", passportError("login"), login);
router.get("/current", passportError("jwt"), currentUser);
router.post("/logout", logout)

export default router