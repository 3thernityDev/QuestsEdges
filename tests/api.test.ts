import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";

// Mock des variables d'environnement AVANT d'importer l'app
vi.stubEnv("NODE_ENV", "test");
vi.stubEnv("PORT", "3000");
vi.stubEnv("DATABASE_URL", "mysql://test:test@localhost:3306/test");
vi.stubEnv("JWT_SECRET", "test-secret-key-minimum-32-characters-long");
vi.stubEnv("AZURE_CLIENT_ID", "test-client-id");
vi.stubEnv("AZURE_SECRET", "test-secret");

// Mock Prisma pour éviter les connexions réelles à la DB
vi.mock("../src/config/bdd", () => ({
    default: {
        $connect: vi.fn().mockResolvedValue(undefined),
        $disconnect: vi.fn().mockResolvedValue(undefined),
        user: {
            findMany: vi.fn().mockResolvedValue([]),
            findUnique: vi.fn().mockResolvedValue(null),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        challenges: {
            findMany: vi.fn().mockResolvedValue([]),
            findUnique: vi.fn().mockResolvedValue(null),
        },
        actions: {
            findMany: vi.fn().mockResolvedValue([]),
            findUnique: vi.fn().mockResolvedValue(null),
        },
        badges: {
            findMany: vi.fn().mockResolvedValue([]),
            findUnique: vi.fn().mockResolvedValue(null),
        },
        notifications: {
            findMany: vi.fn().mockResolvedValue([]),
        },
    },
}));

import app from "../src/app";

describe("API Routes - Public Endpoints", () => {
    
    describe("GET /", () => {
        it("should return API running message", async () => {
            const response = await request(app).get("/");
            expect(response.status).toBe(200);
            expect(response.text).toContain("API QuestsEdges running");
        });
    });

    describe("GET /health", () => {
        it("should return health status with database connected", async () => {
            const response = await request(app).get("/health");
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("status", "ok");
            expect(response.body).toHaveProperty("database", "connected");
        });
    });

    describe("GET /api/challenges", () => {
        it("should return list of challenges", async () => {
            const response = await request(app).get("/api/challenges");
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message");
            expect(response.body).toHaveProperty("challenges");
        });
    });

    describe("GET /api/challenges/active", () => {
        it("should return list of active challenges", async () => {
            const response = await request(app).get("/api/challenges/active");
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("challenges");
        });
    });

    describe("GET /api/actions", () => {
        it("should return list of actions", async () => {
            const response = await request(app).get("/api/actions");
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message");
        });
    });

    describe("GET /api/badges", () => {
        it("should return list of badges", async () => {
            const response = await request(app).get("/api/badges");
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message");
        });
    });
});

describe("API Routes - Protected Endpoints (401 without auth)", () => {

    describe("GET /api/users", () => {
        it("should return 401 without authentication", async () => {
            const response = await request(app).get("/api/users");
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message");
        });
    });

    describe("GET /api/auth/me", () => {
        it("should return 401 without authentication", async () => {
            const response = await request(app).get("/api/auth/me");
            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/challenges", () => {
        it("should return 401 without authentication", async () => {
            const response = await request(app)
                .post("/api/challenges")
                .send({ title: "Test Challenge" });
            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/actions", () => {
        it("should return 401 without authentication", async () => {
            const response = await request(app)
                .post("/api/actions")
                .send({ name: "Test Action" });
            expect(response.status).toBe(401);
        });
    });

    describe("POST /api/badges", () => {
        it("should return 401 without authentication", async () => {
            const response = await request(app)
                .post("/api/badges")
                .send({ name: "Test Badge" });
            expect(response.status).toBe(401);
        });
    });
});

describe("API Routes - 404 Handling", () => {
    it("should return 404 for unknown routes", async () => {
        const response = await request(app).get("/api/unknown-route");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message");
    });

    it("should return 404 for unknown API endpoints", async () => {
        const response = await request(app).get("/api/nonexistent");
        expect(response.status).toBe(404);
    });
});

describe("API Routes - Invalid IDs", () => {
    describe("GET /api/challenges/:id", () => {
        it("should return 400 for invalid challenge ID", async () => {
            const response = await request(app).get("/api/challenges/invalid");
            expect(response.status).toBe(400);
        });

        it("should return 404 for non-existent challenge", async () => {
            const response = await request(app).get("/api/challenges/99999");
            expect(response.status).toBe(404);
        });
    });

    describe("GET /api/actions/:id", () => {
        it("should return 400 for invalid action ID", async () => {
            const response = await request(app).get("/api/actions/invalid");
            expect(response.status).toBe(400);
        });
    });

    describe("GET /api/badges/:id", () => {
        it("should return 400 for invalid badge ID", async () => {
            const response = await request(app).get("/api/badges/invalid");
            expect(response.status).toBe(400);
        });
    });
});

describe("API Security Headers", () => {
    it("should have security headers from helmet", async () => {
        const response = await request(app).get("/");
        
        // Helmet ajoute ces headers
        expect(response.headers).toHaveProperty("x-content-type-options");
        expect(response.headers).toHaveProperty("x-frame-options");
    });
});
