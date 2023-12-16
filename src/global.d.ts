declare global {
  namespace NodeJS {
    interface ProcessEnv extends EgovEnv {}
  }
  interface EgovEnv {
    readonly NODE_ENV: 'production' | 'development';
    readonly PORT: string;

    readonly DB_TYPE: string;
    readonly DB_HOST: string;
    readonly DB_PORT: string;
    readonly DB_SCHEMA: string;
    readonly DB_NAME: string;
    readonly DB_USER: string;
    readonly DB_PASSWORD: string;

    readonly SWAGGER_PATH: string;

    readonly UI_BUILD_PATH: string;

    readonly KEYCLOAK_SECRET: string;
    readonly KEYCLOAK_CLIENT_ID: string;
    readonly KEYCLOAK_REALM: string;
    readonly KEYCLOAK_AUTH_URL: string;

    readonly AZURE_EGOV_URL: string;
    readonly AZURE_EGOV_HEADER: string;
    readonly AZURE_EGOV_KEY: string;
  }
}

export type {};
