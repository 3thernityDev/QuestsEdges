import express from "express";
import dotenv from "dotenv";
import prisma from "./config/bdd";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
