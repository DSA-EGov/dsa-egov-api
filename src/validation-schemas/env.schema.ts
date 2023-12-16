import Joi from 'joi';

export const envValidationSchema = Joi.object<EgovEnv>({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().port().default(3000),

  DB_TYPE: Joi.string().default('postgres'),
  DB_SCHEMA: Joi.string().default('public'),
  DB_HOST: Joi.string().default('localhost'),
  DB_NAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_USER: Joi.string().default('postgres'),
  DB_PORT: Joi.number().port().default(5432),

  SWAGGER_PATH: Joi.string().default('api'),

  UI_BUILD_PATH: Joi.string(),

  KEYCLOAK_SECRET: Joi.string().required(),
  KEYCLOAK_AUTH_URL: Joi.string().required(),
  KEYCLOAK_CLIENT_ID: Joi.string().required(),
  KEYCLOAK_REALM: Joi.string().required(),
});
