import cors from "cors";

// Liste des origines autorisees depuis .env (separees par des virgules)
// Exemple: ALLOWED_ORIGINS=http://localhost:5173,https://monsite.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:3000", "http://localhost:5173"];

// Configuration CORS
export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Autoriser les requetes sans origin (ex: Postman, curl, plugin MC)
        if (!origin) {
            callback(null, true);
            return;
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS: Origin non autorisee"));
        }
    },
    credentials: true, // Autoriser les cookies/credentials
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Total-Count"], // Headers exposes au client
    maxAge: 86400, // Cache preflight pendant 24h
};

export default cors(corsOptions);
