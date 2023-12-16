import App from '@/app';
import UserDataBase from '@/db/user/user.db';
import { Main } from '@/main';
import type { Request, Response, Express, NextFunction } from 'express';
import { join } from 'path';
import CONSTS from './consts';
import fs from 'fs';
import fsExtra from 'fs-extra';
import {
  type User,
  $Enums,
  type File,
  type StreamUrl,
  type UrlCom,
  StreamType
} from '@prisma/client';
import FileDatabase from '@/db/file/file.db';
import StreamUrlDataBase from '@/db/streamUrl/streamUrl.db';
import UrlComDatabase from '@/db/urlCom/urlCom.db';

export function InitializeAppForTest(): Express {
  Main(false);
  return App.getInstance().app;
}

export function FileNameRouteInternal(
  dirname: string,
  fileName: string,
  folderName: $Enums.Type
): string {
  return join(
    dirname,
    `../../${CONSTS.FOLDER_MEDIA_NAME}`,
    folderName.toLowerCase(),
    fileName
  );
}

export function FileNameRouteInternalF(
  dirname: string,
  fileName: string
): string {
  return join(dirname, `../../${CONSTS.FOLDER_MEDIA_NAME}`, fileName);
}

export function DeleteFile(url: string): boolean {
  let deleting = true;
  const filePath = FileNameRouteInternalF(
    __dirname,
    url.replace(`${CONSTS.URL_MEDIA_NAME}/`, '')
  );
  fs.unlink(filePath, (err) => {
    if (err !== null) {
      deleting = false;
    }
  });
  return deleting;
}

export function DeleteFolderUser(id: string): boolean {
  const folders: string[] = ['audio', 'document', 'image', 'video'];
  folders.forEach((folder) => {
    fsExtra.removeSync(FileNameRouteInternalF(__dirname, `${folder}/${id}`));
  });
  return true;
}

export function DeleteCharacterSpecials(str: string): string {
  return str.replace(/[!@#$%^&*(){},":´+¨_\-?'¿`~Ââã©.]/g, (match) =>
    match === ' ' ? match : '-'
  );
}

// Función middleware para verificar el ID de la solicitud
export function VerifyRequestID(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { id } = req.params; // Obtener el ID de la solicitud desde los parámetros de ruta
  VerifyIDUser(id)
    .then((userVery) => {
      if (userVery.is) {
        next();
      } else {
        // Si el ID de la solicitud no es válido, enviar una respuesta de error
        res.status(400).json({ error: 'Invalid request ID' });
      }
    })
    .catch((error) => {
      res
        .status(400)
        .json({ error: `Error VerifyRequestIDUser: ${JSON.stringify(error)}` });
    });
}

export function VerifyRequestIDAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { id } = req.params; // Obtener el ID de la solicitud desde los parámetros de ruta
  VerifyIDUser(id)
    .then((userVery) => {
      if (userVery.is) {
        if (
          userVery.user !== null &&
          userVery.user.role === $Enums.Role.ADMIN
        ) {
          next();
        } else {
          res.status(400).json({ error: 'Invalid User, Not Admin' });
        }
      } else {
        // Si el ID de la solicitud no es válido, enviar una respuesta de error
        res.status(400).json({ error: 'Invalid request ID' });
      }
    })
    .catch((error) => {
      res
        .status(400)
        .json({ error: `Error VerifyRequestIDUser: ${JSON.stringify(error)}` });
    });
}

export function VerifyRequestIDFile(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { idFile } = req.params; // Obtener el ID de la solicitud desde los parámetros de ruta
  VerifyIDFile(idFile)
    .then((fileVery) => {
      if (fileVery.is) {
        next();
      } else {
        // Si el ID de la solicitud no es válido, enviar una respuesta de error
        res.status(400).json({ error: 'Invalid request FILEID' });
      }
    })
    .catch((error) => {
      res
        .status(400)
        .json({ error: `Error VerifyRequestIDFile: ${JSON.stringify(error)}` });
    });
}

export function VerifyRequestIDStreamUrl(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { idStreamUrl } = req.params; // Obtener el ID de la solicitud desde los parámetros de ruta
  VerifyIDStream(idStreamUrl)
    .then((fileVery) => {
      if (fileVery.is) {
        next();
      } else {
        // Si el ID de la solicitud no es válido, enviar una respuesta de error
        res.status(400).json({ error: 'Invalid request FILEID' });
      }
    })
    .catch((error) => {
      res
        .status(400)
        .json({ error: `Error VerifyRequestIDFile: ${JSON.stringify(error)}` });
    });
}

export function VerifyRequestIDUrlCom(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { idStreamUrl } = req.params; // Obtener el ID de la solicitud desde los parámetros de ruta
  VerifyIDUrlCom(idStreamUrl)
    .then((fileVery) => {
      if (fileVery.is) {
        next();
      } else {
        // Si el ID de la solicitud no es válido, enviar una respuesta de error
        res.status(400).json({ error: 'Invalid request FILEID' });
      }
    })
    .catch((error) => {
      res
        .status(400)
        .json({ error: `Error VerifyRequestIDFile: ${JSON.stringify(error)}` });
    });
}

export async function VerifyIDUser(
  id: string
): Promise<{ is: boolean; user: User | null }> {
  const user = await UserDataBase.getInstance().readById(id);
  return { is: user !== null && user !== undefined, user };
}

export async function VerifyIDUserAdmin(
  id: string
): Promise<{ is: boolean; isAdmin: boolean; user: User | null }> {
  const user = await UserDataBase.getInstance().readById(id);
  return {
    is: user !== null && user !== undefined,
    isAdmin: user !== null && user.role === $Enums.Role.ADMIN,
    user
  };
}

export function VerifyEnumTypeStreamType(type: string): StreamType {
  if (type.toLowerCase() === 'prod') return StreamType.PROD;
  else return StreamType.DEV;
}
export async function VerifyIDFile(
  id: string
): Promise<{ is: boolean; file: File | null }> {
  const file = await FileDatabase.getInstance().readById(id);
  return { is: file !== null && file !== undefined, file };
}

export async function VerifyIDStream(
  id: string
): Promise<{ is: boolean; streamUrl: StreamUrl | null }> {
  const streamUrl = await StreamUrlDataBase.getInstance().readById(id);
  return { is: streamUrl !== null && streamUrl !== undefined, streamUrl };
}

export async function VerifyIDUrlCom(
  id: string
): Promise<{ is: boolean; urlCom: UrlCom | null }> {
  const urlCom = await UrlComDatabase.getInstance().readById(id);
  return { is: urlCom !== null && urlCom !== undefined, urlCom };
}

export function GenerateURLLinkRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const file = req.file;
  const files = req.files;
  if (file !== undefined) {
    file.path = GenerateURLLink(file.path);
    file.destination = GenerateURLLink(file.path).replace(
      CONSTS.URL_MEDIA_NAME,
      CONSTS.FOLDER_MEDIA_NAME
    );
    file.size = ConvertByteToMB(file.size);
    next();
  } else if (files !== undefined) {
    if (Array.isArray(files)) {
      req.files = files.map((fil) => {
        return {
          ...fil,
          path: GenerateURLLink(fil.path),
          destination: GenerateURLLink(fil.path).replace(
            CONSTS.URL_MEDIA_NAME,
            CONSTS.FOLDER_MEDIA_NAME
          ),
          size: ConvertByteToMB(fil.size)
        };
      });
      next();
    } else {
      const fileKey = Object.keys(files)[0];
      req.files = files[fileKey].map((f) => {
        return {
          ...f,
          path: GenerateURLLink(f.path),
          destination: GenerateURLLink(f.path).replace(
            CONSTS.URL_MEDIA_NAME,
            CONSTS.FOLDER_MEDIA_NAME
          ),
          size: ConvertByteToMB(f.size)
        };
      });
      next();
    }
  }
}

export function GenerateURLLink(path: string): string {
  return `${path
    .replaceAll('\\', '/')
    .replace(CONSTS.FOLDER_MEDIA_NAME, CONSTS.URL_MEDIA_NAME)}`;
}

export function ConvertByteToMB(sizeByte: number): number {
  return sizeByte / 1024 / 1024;
}

export function GetTime(type: $Enums.Role): `${string}h` {
  switch (type) {
    case 'ADMIN':
      return `${CONSTS.TOKEN_TIME_ADMIN}h`;
    case 'USER':
      return `${CONSTS.TOKEN_TIME_USER}h`;
    default:
      return `${CONSTS.TOKEN_TIME_USER}h`;
  }
}
