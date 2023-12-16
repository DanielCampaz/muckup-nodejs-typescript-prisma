import env from './enviroments';

const CONSTS = {
  FOLDER_MEDIA_NAME: env.FOLDER_MEDIA_NAME ?? 'files',
  URL_MEDIA_NAME: env.URL_MEDIA_NAME ?? 'media',
  SINGLE_FILE_KEY_MULTER: env.SINGLE_FILE_KEY_MULTER ?? 'file',
  MULT_FILE_KEY_MULTER: env.MULT_FILE_KEY_MULTER ?? 'files',
  NMS_API_USER: env.NMS_API_USER ?? 'admin',
  NMS_API_PASS: env.NMS_API_PASS ?? '1234',
  NMS_PORT_HTTP: Number(env.NMS_PORT_HTTP) ?? 8000,
  NMS_APP_NAME: env.NMS_APP_NAME ?? 'live',
  NMS_AUTH_KEY: env.NMS_AUTH_KEY ?? 'dev',
  TOKEN_TIME_ADMIN: env.TOKEN_TIME_ADMIN ?? '24',
  TOKEN_TIME_USER: env.TOKEN_TIME_USER ?? '2'
};

export default CONSTS;
