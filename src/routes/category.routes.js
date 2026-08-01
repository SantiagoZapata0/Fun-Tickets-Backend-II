import { Router } from "express";
import { passportError } from "../middlewares/passport.middleware.js"
import { getAllCategories, createOneCategory } from "../controllers/category.controller.js";
import { authRoles } from "../middlewares/auth.middleware.js"

const router = Router();

router.use(passportError("jwt"));

router.get("/", getAllCategories);
router.post("/", authRoles(["admin"]), createOneCategory);

export default router;