export type ExternalServiceConfig = {
  baseUrl: string;
  apiKey: string;
};

function requiredIntegrationConfig(prefix: string): ExternalServiceConfig {
  const baseUrl = process.env[`${prefix}_BASE_URL`];
  const apiKey = process.env[`${prefix}_API_KEY`];

  if (!baseUrl || !apiKey) {
    throw new Error(`${prefix}_BASE_URL and ${prefix}_API_KEY are required.`);
  }

  return { baseUrl, apiKey };
}

export const getBotcakeConfig = () => requiredIntegrationConfig("BOTCAKE");
export const getPaymentServiceConfig = () =>
  requiredIntegrationConfig("PAYMENT_SERVICE");
export const getContavoConfig = () => requiredIntegrationConfig("CONTAVO");
