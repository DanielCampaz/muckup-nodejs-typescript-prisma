// import type { FileFolder } from '@/types/types';
import multer, {
  type FileFilterCallback,
  type Multer,
  type Options
} from 'multer';
import { extname, join } from 'path';
import { DeleteCharacterSpecials, VerifyIDUser } from './functions';
import type { Request } from 'express';
import fs from 'fs';
import CONSTS from './consts';
import type { $Enums } from '@prisma/client';

export interface AcceptedFiles {
  _documentAc?: string[];
  _videoAc?: string[];
  _audioAc?: string[];
  _imgAc?: string[];
}

export interface FileMulter {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export type FunctionTypeMulterMiddleware = (
  req: Request,
  file: FileMulter,
  cb: (error, data) => void
) => void;

export default class MulterImplementation {
  multer: Multer;
  documentAc: string[];
  videoAc: string[];
  audioAc: string[];
  imgAc: string[];

  constructor(
    public folderSave: $Enums.Type,
    configMulter: Omit<Options, 'dest' | 'limits' | 'fileFilter' | 'storage'>,
    acceptedFiles: AcceptedFiles
  ) {
    this.documentAc = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    this.videoAc = [
      'video/mp4',
      'video/x-matroska',
      'video/quicktime',
      'video/mpeg'
    ];
    this.audioAc = ['audio/wav', 'audio/mpeg', 'audio/mp3'];
    this.imgAc = ['image/jpeg', 'image/jpg', 'image/png', 'image/x-icon'];

    this.mergeCustomAcceptedFiles(acceptedFiles);

    this.multer = multer({
      storage: multer.diskStorage({
        ...configMulter,
        destination: this.destinationFolder(this),
        filename: this.filenameConfig()
      }),
      limits: {
        fieldSize: 10000000000 // 10MB
      },
      fileFilter: (_req, file, cb) => {
        switch (this.folderSave) {
          case 'DOCUMENT':
            this.documentFilter(file, cb);
            break;
          case 'VIDEO':
            this.videoFilter(file, cb);
            break;
          case 'AUDIO':
            this.audioFilter(file, cb);
            break;
          case 'IMAGE':
            this.imageFilter(file, cb);
            break;
          default:
            cb(
              new Error(
                `Invalid type. Accepted types are: "document" | "video" | "audio" | "image"`
              )
            );
            break;
        }
      }
    });
  }

  private filenameConfig(): FunctionTypeMulterMiddleware {
    return (_req, file, cb) => {
      const fileExtension = extname(file.originalname);
      const fileName = DeleteCharacterSpecials(
        file.originalname
          .split(fileExtension)[0]
          .replace(/\s/g, '')
          .toLocaleLowerCase()
      );
      cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    };
  }

  private destinationFolder(
    multer: MulterImplementation
  ): FunctionTypeMulterMiddleware {
    return function (req, _file, cb) {
      VerifyIDUser(req.params.id)
        .then((userV) => {
          if (userV.is) {
            const folder = multer.folderSave.toLocaleLowerCase();
            const userFolder = join(
              join(`${CONSTS.FOLDER_MEDIA_NAME}/`, `${folder}/`),
              req.params.id
            ); // Ruta para la carpeta del usuario

            // Verificar si la carpeta del usuario existe
            if (!fs.existsSync(userFolder)) {
              // Si la carpeta no existe, crearla
              fs.mkdirSync(userFolder);
            }

            // Indicar la carpeta donde se guardarán los archivos
            cb(null, userFolder);
          } else {
            cb(new Error('Invalid request ID'), null);
          }
        })
        .catch((error) => {
          console.log(
            `Error Destination Folder Multer: ${JSON.stringify(error)}`
          );
        });
    };
  }

  private mergeCustomAcceptedFiles(files: AcceptedFiles): void {
    if (files._documentAc !== undefined) {
      this.documentAc.push(...files._documentAc);
    }

    if (files._videoAc !== undefined) {
      this.videoAc.push(...files._videoAc);
    }

    if (files._audioAc !== undefined) {
      this.audioAc.push(...files._audioAc);
    }

    if (files._imgAc !== undefined) {
      this.imgAc.push(...files._imgAc);
    }
  }

  private documentFilter(file: FileMulter, cb: FileFilterCallback): void {
    if (this.documentAc.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new Error(
          `Invalid document type. Accepted types are: ${this.documentAc.join(
            ', '
          )}`
        )
      );
  }

  private videoFilter(file: FileMulter, cb: FileFilterCallback): void {
    if (this.videoAc.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new Error(
          `Invalid video type. Accepted types are: ${this.videoAc.join(', ')}`
        )
      );
  }

  private audioFilter(file: FileMulter, cb: FileFilterCallback): void {
    if (this.audioAc.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid audio type. Accepted types are: ${this.audioAc.join(', ')}`
        )
      );
    }
  }

  private imageFilter(file: FileMulter, cb: FileFilterCallback): void {
    if (this.imgAc.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new Error(
          `Invalid image type. Accepted types are: ${this.imgAc.join(', ')}`
        )
      );
  }
}
