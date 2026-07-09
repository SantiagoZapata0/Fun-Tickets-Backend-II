// Imports

import express from "express";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

// Import Routes.

import userRoutes from "./routes/user.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import eventRoutes from "./routes/event.routes.js";
import sessionRouter from "./routes/session.routes.js"
import { initalizePassport } from "./config/passport.js";
import passport from "passport";

const app = express();

// ! Middlewares

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

initalizePassport();
app.use(passport.initialize());

app.use((req, res, next) => {
    const date = new Date();
    console.log(`${date.toLocaleString("es-AR")} - ${req.method}`);
    next();
})

app.get("/api/health", (req, res) => {
    res.json({status: "Ok", payload: "Servidor activo"})
})

// ! Routes

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sessions", sessionRouter);

export default app;