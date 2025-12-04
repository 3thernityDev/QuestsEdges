import { Router } from "express";
import {
    getAllChallenges,
    getChallengeById,
    getActiveChallenges,
    createChallenge,
    updateChallenge,
    joinChallenge,
    deleteChallenge,
} from "../controllers/challengesController";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware";
import taskRoutes from "./taskRoutes";

const challengeRouter = Router();

challengeRouter.get("/", getAllChallenges);
challengeRouter.get("/active", getActiveChallenges);
challengeRouter.get("/:id", getChallengeById);
challengeRouter.post("/", isAuthenticated, isAdmin, createChallenge);
challengeRouter.put("/:id", isAuthenticated, isAdmin, updateChallenge);
challengeRouter.delete("/:id", isAuthenticated, isAdmin, deleteChallenge);
challengeRouter.post("/:id/join", isAuthenticated, joinChallenge);

// Routes des tâches imbriquées sous /challenges/:challengeId/tasks
challengeRouter.use("/:challengeId/tasks", taskRoutes);

export default challengeRouter;
