import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import prisma from "./config/bdd";
import corsMiddleware from "./config/cors";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import challengeRouter from "./routes/challengeRoutes";
import actionRouter from "./routes/actionRoutes";
import progressRouter from "./routes/progressRoutes";
import badgeRouter from "./routes/badgeRoutes";
import notificationRouter from "./routes/notificationRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// CORS
app.use(corsMiddleware);

app.get("/", (req, res) => {
    res.send("API MSP2 running !");
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
