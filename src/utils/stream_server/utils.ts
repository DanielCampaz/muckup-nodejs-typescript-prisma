import CONSTS from '../consts';
import { config } from './config';

export function getUrlStream(
  url: string,
  pathStream: string,
  type: 'flv' | 'm3u8' | 'mpd' = 'flv'
): string {
  switch (type) {
    case 'flv':
      return `${url}${pathStream}.flv?auth=${CONSTS.NMS_AUTH_KEY}`;
    case 'm3u8':
      return `${url}${pathStream}/index.m3u8?auth=${CONSTS.NMS_AUTH_KEY}`;
    case 'mpd':
      return `${url}${pathStream}/index.mpd?auth=${CONSTS.NMS_AUTH_KEY}`;
    default:
      return 'error';
  }
}
/*
  Verificamos la estructura que vengo como estan en los comentarios, esas son las aceptados 
*/
export function verifyStructur(path: string): boolean {
  if (path.includes(`/${config.trans.tasks[0].app}/`)) {
    const patternW = /^\/\w+\/\w+_\w+\/\w+$/;
    // const exampleString = '/live/lknlknlkn_bkjbkjbkj/lknlknlkn';
    const isValidW = patternW.test(path);

    if (isValidW) {
      return true;
    } else {
      return false;
    }
  } else {
    const patternS = /^\/\w+_\w+\/\w+$/;
    // const exampleString = '/lknlknlkn_bkjbkjbkj/lknlknlkn';
    const isValidS = patternS.test(path);

    if (isValidS) {
      return true;
    } else {
      return false;
    }
  }
}

/* Aqui separamos la informacion del stream 
  path.includes(`/${config.trans.tasks[0].app}/`) verifica si el stream viene como "/live/data" o como "/livedata/"
*/
export function seprStreamKey(path: string): {
  app: string;
  idStream: string;
  idUser: string;
  password: string;
  streamPath: string;
} {
  if (path.includes(`/${config.trans.tasks[0].app}/`)) {
    const namePasswordF = path.split('/').filter((e) => e !== '');
    const appIDSs = namePasswordF[1].split('_');
    return {
      app: namePasswordF[0],
      idStream: appIDSs[0],
      idUser: appIDSs[1],
      password: namePasswordF[2],
      streamPath: path
    };
  } else {
    const namePassword = path.split('/').filter((e) => e !== '');
    const appIDS = namePassword[0]
      .split(config.trans.tasks[0].app)
      .map((e, index) => {
        if (index === 0) {
          return config.trans.tasks[0].app;
        } else {
          return e;
        }
      });
    const ids = appIDS[1].split('_');
    return {
      app: appIDS[0],
      idStream: ids[0],
      idUser: ids[1],
      password: namePassword[1],
      streamPath: path
    };
  }
}
