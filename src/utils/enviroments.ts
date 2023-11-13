import dotenv from 'dotenv';

dotenv.config();
export type EnvInterface = Record<string, string | undefined>;

const env: EnvInterface = {
  EXPRESS_PORT: process.env.EXPRESS_PORT,
  SECRET_TOKEN_JWT: process.env.SECRET_TOKEN_JWT
};

export default env;
