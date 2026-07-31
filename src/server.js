import { env } from "./config/env.js";
import { connectDB } from "./config/database.js";
import app from "./app.js";

app.listen(env.PORT, () => {

    connectDB()
    .then(() => console.log("Base de datos conectada a MongoDB Atlas"))
    .catch((err) => console.error("Error al conectar la base de datos:", err))

    console.log(`Server ON. Puerto: ${env.PORT}`);
});

const filter = {category: "music", date: {$gte: new Date("2026-01-01")}}