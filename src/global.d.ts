declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
  interface Env {
    readonly NODE_ENV: 'production' | 'development';
    readonly PORT: string;
    readonly DB_TYPE: string;
    readonly DB_HOST: string;
    readonly DB_PORT: string;
    readonly DB_SCHEMA: string;
    readonly DB_NAME: string;
    readonly DB_USER: string;
    readonly DB_PASSWORD: string;
  }
}


export type {};
