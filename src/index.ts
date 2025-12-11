import dotenv from "dotenv";
dotenv.config();

import { getEnv } from "@config/env.js";
import app from "./app.js";

// Valider les variables d'environnement au demarrage
const env = getEnv();
const PORT = env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
