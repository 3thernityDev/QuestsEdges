import { Router } from "express";
import {
    getAllChallenges,
    getChallengeById,
    getActiveChallenges,
    createChallenge,
    updateChallenge,
    joinChallenge,
} from "../controllers/challengesController";
import { isAdmin, isAuthenticated } from "../middlewares/authMiddleware";

const challengeRouter = Router();

challengeRouter.get("/", getAllChallenges);
challengeRouter.get("/active", getActiveChallenges);
challengeRouter.get("/id/:id", getChallengeById);
challengeRouter.post("/", isAuthenticated, isAdmin, createChallenge);
challengeRouter.put("/:id", isAuthenticated, isAdmin, updateChallenge);
challengeRouter.post("/join/:id", isAuthenticated, joinChallenge);

export default challengeRouter;
