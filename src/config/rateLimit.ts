import rateLimit from "express-rate-limit";

// Rate limiter global - limite les requetes par IP
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requetes par fenetre de 15 min
    message: {
        status: 429,
        message: "Trop de requetes, veuillez reessayer plus tard",
    },
    standardHeaders: true, // Retourne les headers `RateLimit-*`
    legacyHeaders: false, // Desactive les headers `X-RateLimit-*`
});

// Rate limiter strict pour l'authentification
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 tentatives par fenetre de 15 min
    message: {
        status: 429,
        message: "Trop de tentatives de connexion, veuillez reessayer dans 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter pour les endpoints sensibles (creation, modification)
export const writeLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requetes par minute
    message: {
        status: 429,
        message: "Trop de requetes d'ecriture, veuillez reessayer plus tard",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter pour le plugin Minecraft (plus permissif)
export const systemLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 500, // 500 requetes par minute (le plugin envoie beaucoup de requetes)
    message: {
        status: 429,
        message: "Rate limit atteint pour le systeme",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
