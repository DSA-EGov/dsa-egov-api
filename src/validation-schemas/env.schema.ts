import Joi from 'joi';

export const envValidationSchema = Joi.object<Env>({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().port().default(3000),
  DB_TYPE: Joi.string().default('postgres'),
  DB_SCHEMA: Joi.string().default('public'),
  DB_HOST: Joi.string().default('localhost'),
  DB_NAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('password'),
  DB_USER: Joi.string().default('postgres'),
  DB_PORT: Joi.number().port().default(5432),
});
