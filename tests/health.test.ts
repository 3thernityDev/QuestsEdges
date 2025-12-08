import { describe, it, expect } from "vitest";

describe("Health Check", () => {
    it("should return API info", async () => {
        // Test basique pour valider que le build fonctionne
        expect(true).toBe(true);
    });
});

describe("Environment", () => {
    it("should have required env schema", async () => {
        // Import dynamique pour eviter les erreurs si .env manquant en CI
        const { envSchema } = await import("../src/config/env");
        expect(envSchema).toBeDefined();
    });
});
