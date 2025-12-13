import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/bdd';

// Configuration OAuth Microsoft
const MICROSOFT_CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const MICROSOFT_CLIENT_SECRET = process.env.AZURE_SECRET!;
const REDIRECT_URI =
    process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/microsoft/callback';

// ======================================================
// ========== MICROSOFT OAUTH / XBOX LIVE ===============
// ======================================================

// GET /api/auth/microsoft - Redirige vers Microsoft
export const getMicrosoftAuthUrl = (req: Request, res: Response): void => {
    const scope = 'XboxLive.signin offline_access openid email profile';

    const authUrl =
        `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?` +
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

        // Extraire l'email depuis l'ID token (JWT)
        const emailFromToken = extractEmailFromIdToken(microsoftToken.id_token);

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
                email: emailFromToken || undefined, // Met à jour l'email si disponible
                last_login: new Date(),
            },
            create: {
                uuid_mc: minecraftProfile.id,
                username: minecraftProfile.name,
                email: emailFromToken || `${minecraftProfile.id}@minecraft.local`,
            },
        });

        // 6. Générer un JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });

        // 7. Retourner le token en JSON (pas de frontend pour l'instant)
        res.status(200).json({
            message: 'Authentification réussie',
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
            error: (error as Error).message,
        });
    }
};

// GET /api/auth/me - Récupérer les infos de l'utilisateur connecté
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({ message: 'Non authentifié' });
            return;
        }

        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                uuid_mc: user.uuid_mc,
                email: user.email,
                role: user.role,
                created_at: user.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du profil',
            error: (error as Error).message,
        });
    }
};

// POST /api/auth/logout - Déconnexion (côté client, invalider le token)
export const logout = (req: Request, res: Response): void => {
    // Le JWT est stateless, donc on ne peut pas vraiment l'invalider côté serveur
    // Le frontend doit simplement supprimer le token
    res.status(200).json({ message: 'Déconnexion réussie' });
};

// POST /api/auth/system-token - Génère un token pour le système (plugin MC)
export const generateSystemToken = async (req: Request, res: Response): Promise<void> => {
    try {
        // UUID système fixe (ne correspond à aucun vrai joueur MC)
        const SYSTEM_UUID = '00000000-0000-0000-0000-000000000000';
        const SYSTEM_USERNAME = 'MC_SYSTEM';
        const SYSTEM_EMAIL = 'system@mc-challenges.local';

        // Créer ou récupérer l'utilisateur système
        const systemUser = await prisma.user.upsert({
            where: { uuid_mc: SYSTEM_UUID },
            update: {
                role: 'sys',
            },
            create: {
                uuid_mc: SYSTEM_UUID,
                username: SYSTEM_USERNAME,
                email: SYSTEM_EMAIL,
                role: 'sys',
            },
        });

        // Générer un JWT longue durée (1 an)
        const token = jwt.sign(
            { userId: systemUser.id, role: systemUser.role },
            process.env.JWT_SECRET!,
            { expiresIn: '365d' }
        );

        res.status(200).json({
            message: 'Token système généré avec succès',
            token,
            expiresIn: '365 jours',
            user: {
                id: systemUser.id,
                username: systemUser.username,
                role: systemUser.role,
            },
        });
    } catch (error) {
        console.error('Erreur génération token système:', error);
        res.status(500).json({
            message: 'Erreur lors de la génération du token système',
            error: (error as Error).message,
        });
    }
};

// ======================================================
// ========== FONCTIONS UTILITAIRES OAUTH ===============
// ======================================================

// Extrait l'email depuis l'ID token Microsoft (JWT)
function extractEmailFromIdToken(idToken: string): string | null {
    try {
        // Le JWT est composé de 3 parties séparées par des points
        const payload = idToken.split('.')[1];
        // Décoder le payload base64
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        return decoded.email || null;
    } catch {
        return null;
    }
}

// Échange le code contre un token Microsoft
async function getMicrosoftToken(
    code: string
): Promise<{ access_token: string; id_token: string }> {
    const response = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: MICROSOFT_CLIENT_ID,
            client_secret: MICROSOFT_CLIENT_SECRET,
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
            scope: 'XboxLive.signin offline_access openid email profile',
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur Microsoft Token: ${error}`);
    }

    return response.json();
}

// Authentifie avec Xbox Live
async function getXboxLiveToken(
    microsoftAccessToken: string
): Promise<{ Token: string; DisplayClaims: { xui: [{ uhs: string }] } }> {
    const response = await fetch('https://user.auth.xboxlive.com/user/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            Properties: {
                AuthMethod: 'RPS',
                SiteName: 'user.auth.xboxlive.com',
                RpsTicket: `d=${microsoftAccessToken}`,
            },
            RelyingParty: 'http://auth.xboxlive.com',
            TokenType: 'JWT',
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur Xbox Live: ${error}`);
    }

    return response.json();
}

// Obtient le token XSTS (Xbox Security Token Service)
async function getXSTSToken(
    xboxToken: string
): Promise<{ Token: string; DisplayClaims: { xui: [{ uhs: string }] } }> {
    const response = await fetch('https://xsts.auth.xboxlive.com/xsts/authorize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            Properties: {
                SandboxId: 'RETAIL',
                UserTokens: [xboxToken],
            },
            RelyingParty: 'rp://api.minecraftservices.com/',
            TokenType: 'JWT',
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur XSTS: ${error}`);
    }

    return response.json();
}

// Récupère le profil Minecraft
async function getMinecraftProfile(xstsData: {
    Token: string;
    DisplayClaims: { xui: [{ uhs: string }] };
}): Promise<{ id: string; name: string }> {
    const uhs = xstsData.DisplayClaims.xui[0].uhs;
    const xstsToken = xstsData.Token;

    // 1. D'abord, obtenir le token Minecraft
    const mcAuthResponse = await fetch(
        'https://api.minecraftservices.com/authentication/login_with_xbox',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identityToken: `XBL3.0 x=${uhs};${xstsToken}`,
            }),
        }
    );

    if (!mcAuthResponse.ok) {
        const error = await mcAuthResponse.text();
        throw new Error(`Erreur Minecraft Auth: ${error}`);
    }

    const mcAuth = await mcAuthResponse.json();

    // 2. Récupérer le profil avec le token Minecraft
    const profileResponse = await fetch('https://api.minecraftservices.com/minecraft/profile', {
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
