import 'dotenv/config';
import * as joi from 'joi';

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    NATS_URL: joi.array().items(joi.string()).required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().default(5432),
    DB_USERNAME: joi.string().required(),
    SECRET_JWT: joi.string().required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_URL: process.env.NATS_URL?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface Env {
  PORT: number;
  NATS_URL: string[];
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  SECRET_JWT: string;
}

const env: Env = value as Env;

export const envs = {
  PORT: env?.PORT,
  NATS_URL: env?.NATS_URL,
  DB_PASSWORD: env?.DB_PASSWORD,
  DB_NAME: env?.DB_NAME,
  DB_HOST: env?.DB_HOST,
  DB_PORT: env?.DB_PORT,
  DB_USERNAME: env?.DB_USERNAME,
  SECRET_JWT: env?.SECRET_JWT,
};
