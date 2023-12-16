import dotenv from 'dotenv';

dotenv.config();
export type EnvInterface = Record<string, string | undefined>;

const env: EnvInterface = {
  EXPRESS_PORT: process.env.EXPRESS_PORT,
  SECRET_TOKEN_JWT: process.env.SECRET_TOKEN_JWT,
  FOLDER_MEDIA_NAME: process.env.FOLDER_MEDIA_NAME,
  URL_MEDIA_NAME: process.env.URL_MEDIA_NAME,
  SINGLE_FILE_KEY_MULTER: process.env.SINGLE_FILE_KEY_MULTER,
  MULT_FILE_KEY_MULTER: process.env.MULT_FILE_KEY_MULTER,
  OBJECT_KEY_TO_VERIFICATE_PRISMA_CONNECTION:
    process.env.OBJECT_KEY_TO_VERIFICATE_PRISMA_CONNECTION,
  NMS_API_USER: process.env.NMS_API_USER,
  NMS_API_PASS: process.env.NMS_API_PASS,
  EMAIL_NODEMAILER: process.env.EMAIL_NODEMAILER,
  PASSWORD_NODEMAILER: process.env.PASSWORD_NODEMAILER,
  NMS_PORT_HTTP: process.env.NMS_PORT_HTTP,
  NMS_APP_NAME: process.env.NMS_APP_NAME,
  NMS_AUTH_KEY: process.env.NMS_AUTH_KEY
};

export default env;
