import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../config/bdd";
import bcrypt from "bcrypt";

// Configuration OAuth Microsoft
const MICROSOFT_CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const MICROSOFT_CLIENT_SECRET = process.env.AZURE_SECRET!;
const REDIRECT_URI = "http://localhost:3000/api/auth/microsoft/callback";
const JWT_SECRET = process.env.JWT_SECRET;

// Stockage temporaire des codes de liaison (en production, utiliser Redis)
const linkCodes = new Map<string, { createdAt: Date; expiresAt: Date }>();

// Nettoyer les codes expirés toutes les minutes
setInterval(() => {
    const now = new Date();
    for (const [code, data] of linkCodes.entries()) {
        if (now > data.expiresAt) {
            linkCodes.delete(code);
        }
    }
}, 60000);

// ===========================================
// ========== LINK IN-GAME AUTH ==============
// ===========================================

// POST /api/auth/link/generate - Génère un code de liaison
export const generateLinkCode = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Générer un code aléatoire de 6 caractères (majuscules + chiffres)
        const code = crypto.randomBytes(3).toString("hex").toUpperCase();

        // Stocker le code avec une expiration de 5 minutes
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

        linkCodes.set(code, { createdAt: now, expiresAt });

        res.status(200).json({
            message: "Code de liaison généré",
            code,
            expiresIn: "5 minutes",
            instruction:
                "Tapez /link " + code + " en jeu pour lier votre compte",
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la génération du code",
            error: (error as Error).message,
        });
    }
};

// POST /api/auth/link/complete - Le plugin valide le code (appelé par le plugin Minecraft)
export const completeLinkCode = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { code, uuid_mc, username } = req.body;

        // Validation des données
        if (!code || !uuid_mc || !username) {
            res.status(400).json({
                message: "Données manquantes: code, uuid_mc et username requis",
            });
            return;
        }

        // Vérifier que le code existe
        const linkData = linkCodes.get(code.toUpperCase());

        if (!linkData) {
            res.status(404).json({ message: "Code invalide ou expiré" });
            return;
        }

        // Vérifier que le code n'est pas expiré
        if (new Date() > linkData.expiresAt) {
            linkCodes.delete(code.toUpperCase());
            res.status(410).json({ message: "Code expiré" });
            return;
        }

        // Supprimer le code (usage unique)
        linkCodes.delete(code.toUpperCase());

        // Créer ou mettre à jour l'utilisateur
        const user = await prisma.user.upsert({
            where: { uuid_mc },
            update: {
                username,
                last_login: new Date(),
            },
            create: {
                uuid_mc,
                username,
                email: `${uuid_mc}@minecraft.local`, // Email placeholder
            },
        });

        // Générer le JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Compte lié avec succès",
            token,
            user: {
                id: user.id,
                username: user.username,
                uuid_mc: user.uuid_mc,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la liaison du compte",
            error: (error as Error).message,
        });
    }
};

// GET /api/auth/link/verify/:code - Vérifie si un code est valide (optionnel)
export const verifyLinkCode = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { code } = req.params;

    const linkData = linkCodes.get(code.toUpperCase());

    if (!linkData || new Date() > linkData.expiresAt) {
        res.status(404).json({
            valid: false,
            message: "Code invalide ou expiré",
        });
        return;
    }

    res.status(200).json({
        valid: true,
        expiresAt: linkData.expiresAt,
    });
};

// ========================
// ========= LOGIN ========
// ========================

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation des données
        if (!email || !password) {
            res.status(400).json({
                message: "Données manquantes: email et password requis",
            });
            return;
        }

        // Verifier les informations d'identification
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            res.status(401).json({
                message: "Email ou mot de passe incorrect",
            });
            return;
        }

        // Verifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                message: "Email ou mot de passe incorrect",
            });
            return;
        }
        // Générer le JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );
        res.status(200).json({
            message: "Authentification réussie",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de l'authentification",
            error: (error as Error).message,
        });
    }
};

// ======================================================
// ========== MICROSOFT OAUTH (IN WAIT OF APPROVAL)======
// ======================================================

/*
// GET /api/auth/microsoft - Redirige vers Microsoft
export const getMicrosoftAuthUrl = (req: Request, res: Response): void => {
    const scope = "XboxLive.signin offline_access";
    
    const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?` +
        `client_id=${MICROSOFT_CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&response_mode=query`;
    
    res.redirect(authUrl);
};

// GET /api/auth/microsoft/callback - Callback après login
export const microsoftCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        const code = req.query.code as string;
        
        if (!code) {
            res.status(400).json({ message: "Code d'autorisation manquant" });
            return;
        }

        // 1. Échanger le code contre un access token Microsoft
        const microsoftToken = await getMicrosoftToken(code);
        
        // 2. Authentifier avec Xbox Live
        const xboxToken = await getXboxLiveToken(microsoftToken.access_token);
        
        // 3. Obtenir le token XSTS
        const xstsToken = await getXSTSToken(xboxToken.Token);
        
        // 4. Récupérer le profil Minecraft
        const minecraftProfile = await getMinecraftProfile(xstsToken);
        
        // 5. Créer ou mettre à jour l'utilisateur en base
        const user = await prisma.user.upsert({
            where: { uuid_mc: minecraftProfile.id },
            update: {
                username: minecraftProfile.name,
                last_login: new Date(),
            },
            create: {
                uuid_mc: minecraftProfile.id,
                username: minecraftProfile.name,
                email: `${minecraftProfile.id}@minecraft.local`, // Email placeholder
            },
        });

        // 6. Générer un JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 7. Retourner le token (ou rediriger vers le frontend)
        res.json({
            message: "Authentification réussie",
            token,
            user: {
                id: user.id,
                username: user.username,
                uuid_mc: user.uuid_mc,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        res.status(500).json({ 
            message: "Erreur lors de l'authentification",
            error: (error as Error).message 
        });
    }
};

// === Fonctions utilitaires pour le flow OAuth ===

// Échange le code contre un token Microsoft
async function getMicrosoftToken(code: string): Promise<{ access_token: string }> {
    const response = await fetch("https://login.microsoftonline.com/consumers/oauth2/v2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: MICROSOFT_CLIENT_ID,
            client_secret: MICROSOFT_CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
            scope: "XboxLive.signin offline_access",
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur Microsoft Token: ${error}`);
    }

    return response.json();
}

// Authentifie avec Xbox Live
async function getXboxLiveToken(microsoftAccessToken: string): Promise<{ Token: string; DisplayClaims: { xui: [{ uhs: string }] } }> {
    const response = await fetch("https://user.auth.xboxlive.com/user/authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            Properties: {
                AuthMethod: "RPS",
                SiteName: "user.auth.xboxlive.com",
                RpsTicket: `d=${microsoftAccessToken}`,
            },
            RelyingParty: "http://auth.xboxlive.com",
            TokenType: "JWT",
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur Xbox Live: ${error}`);
    }

    return response.json();
}

// Obtient le token XSTS (Xbox Security Token Service)
async function getXSTSToken(xboxToken: string): Promise<{ Token: string; DisplayClaims: { xui: [{ uhs: string }] } }> {
    const response = await fetch("https://xsts.auth.xboxlive.com/xsts/authorize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            Properties: {
                SandboxId: "RETAIL",
                UserTokens: [xboxToken],
            },
            RelyingParty: "rp://api.minecraftservices.com/",
            TokenType: "JWT",
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur XSTS: ${error}`);
    }

    return response.json();
}

// Récupère le profil Minecraft
async function getMinecraftProfile(xstsData: { Token: string; DisplayClaims: { xui: [{ uhs: string }] } }): Promise<{ id: string; name: string }> {
    const uhs = xstsData.DisplayClaims.xui[0].uhs;
    const xstsToken = xstsData.Token;

    // 1. D'abord, obtenir le token Minecraft
    const mcAuthResponse = await fetch("https://api.minecraftservices.com/authentication/login_with_xbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            identityToken: `XBL3.0 x=${uhs};${xstsToken}`,
        }),
    });

    if (!mcAuthResponse.ok) {
        const error = await mcAuthResponse.text();
        throw new Error(`Erreur Minecraft Auth: ${error}`);
    }

    const mcAuth = await mcAuthResponse.json();

    // 2. Récupérer le profil avec le token Minecraft
    const profileResponse = await fetch("https://api.minecraftservices.com/minecraft/profile", {
        headers: {
            Authorization: `Bearer ${mcAuth.access_token}`,
        },
    });

    if (!profileResponse.ok) {
        const error = await profileResponse.text();
        throw new Error(`Erreur Minecraft Profile: ${error}`);
    }

    return profileResponse.json();
}
    */
