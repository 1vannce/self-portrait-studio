import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

describe("Integration config resolvers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("getBotcakeConfig returns config when env vars are set", async () => {
    process.env.BOTCAKE_BASE_URL = "https://api.botcake.test";
    process.env.BOTCAKE_API_KEY = "test-key-123";

    const { getBotcakeConfig } = await import(
      "@/lib/integrations/contracts"
    );
    const config = getBotcakeConfig();
    expect(config).toEqual({
      baseUrl: "https://api.botcake.test",
      apiKey: "test-key-123",
    });
  });

  it("getBotcakeConfig throws when env vars are missing", async () => {
    delete process.env.BOTCAKE_BASE_URL;
    delete process.env.BOTCAKE_API_KEY;

    const { getBotcakeConfig } = await import(
      "@/lib/integrations/contracts"
    );
    expect(() => getBotcakeConfig()).toThrow(
      "BOTCAKE_BASE_URL and BOTCAKE_API_KEY are required."
    );
  });

  it("getPaymentServiceConfig returns config when env vars are set", async () => {
    process.env.PAYMENT_SERVICE_BASE_URL = "https://pay.test";
    process.env.PAYMENT_SERVICE_API_KEY = "pay-key";

    const { getPaymentServiceConfig } = await import(
      "@/lib/integrations/contracts"
    );
    const config = getPaymentServiceConfig();
    expect(config).toEqual({
      baseUrl: "https://pay.test",
      apiKey: "pay-key",
    });
  });

  it("getContavoConfig throws when env vars are missing", async () => {
    delete process.env.CONTAVO_BASE_URL;
    delete process.env.CONTAVO_API_KEY;

    const { getContavoConfig } = await import(
      "@/lib/integrations/contracts"
    );
    expect(() => getContavoConfig()).toThrow(
      "CONTAVO_BASE_URL and CONTAVO_API_KEY are required."
    );
  });
});
