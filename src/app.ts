import express from "express";
import helmet from "helmet";
import corsMiddleware from "./config/cors";
import { globalLimiter } from "./config/rateLimit";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import challengeRouter from "./routes/challengeRoutes";
import actionRouter from "./routes/actionRoutes";
import progressRouter from "./routes/progressRoutes";
import badgeRouter from "./routes/badgeRoutes";
import notificationRouter from "./routes/notificationRoutes";
import prisma from "./config/bdd";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Rate limiting global
app.use(globalLimiter);

app.get("/", (req, res) => {
    res.send("API QuestsEdges running !");
});

// Route de test pour la DB
app.get("/health", async (req, res) => {
    try {
        await prisma.$connect();
        res.json({ status: "ok", database: "connected" });
    } catch (error) {
        res.status(500).json({ status: "error", database: "disconnected" });
    }
});

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/challenges", challengeRouter);
app.use("/api/actions", actionRouter);
app.use("/api/progress", progressRouter);
app.use("/api/badges", badgeRouter);
app.use("/api/notifications", notificationRouter);

// Gestion des routes non trouvees (404)
app.use(notFoundHandler);

// Gestion globale des erreurs
app.use(errorHandler);

export default app;
