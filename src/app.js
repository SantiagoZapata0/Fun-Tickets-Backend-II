// Imports

import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.js";
import { env } from "./config/env.js";

// Import Routes.

import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import eventRoutes from "./routes/event.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import categoryRoutes from "./routes/category.routes.js"

const app = express();

// ! Middlewares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
    const date = new Date();
    console.log(`${date.toLocaleString("es-AR")} - ${req.method}`);
    next();
})

app.get("/api/health", (req, res) => {
    res.json({status: "Ok", payload: "Servidor activo"})
})

initializePassport();
app.use(passport.initialize());

// ! Routes

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/categories", categoryRoutes)

export default app;