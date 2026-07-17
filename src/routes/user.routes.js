import { Router } from "express";
import { getUsers} from "../controllers/user.controller.js";
import { passportError } from "../middlewares/passport.middleware.js";
import { authRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", passportError("jwt"), authRoles(["admin"]), getUsers);

export default router;