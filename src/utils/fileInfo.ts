import { PDFDocument } from 'pdf-lib';
import ffmpeg, { type FfprobeData } from 'fluent-ffmpeg';
import sharp, { type Metadata } from 'sharp';
import * as mm from 'music-metadata';
import * as fs from 'fs';
import { FileNameRouteInternal } from './functions';

// __dirname
export default class FileInfo {
  static instance: FileInfo | null = null;
  private constructor() {}

  async countPDFPages(filePath: string): Promise<number> {
    const filePh = FileNameRouteInternal(__dirname, filePath, 'DOCUMENT');
    const pdfBytes = fs.readFileSync(filePh);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getPageCount();
  }

  //   async getDocumentInfo(
  //     filePath: string
  //   ): Promise<{ pageCount: number; size: number }> {}

  async getVideoInfo(filePath: string): Promise<FfprobeData> {
    const filePh = FileNameRouteInternal(__dirname, filePath, 'VIDEO');
    return await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePh, (err, metadata) => {
        if (err !== null || err !== undefined) reject(err);
        else resolve(metadata);
      });
    });
  }

  async getImageInfo(filePath: string): Promise<Metadata> {
    const filePh = FileNameRouteInternal(__dirname, filePath, 'IMAGE');
    return await sharp(filePh).metadata();
  }

  async getAudioInfo(filePath: string): Promise<number> {
    const filePh = FileNameRouteInternal(__dirname, filePath, 'AUDIO');
    const metadata = await mm.parseFile(filePh);
    const duration = metadata.format.duration;
    if (duration === undefined) {
      return 0;
    } else {
      return duration;
    }
  }

  static getInstance(): FileInfo {
    if (this.instance === null) {
      this.instance = new FileInfo();
    }
    return this.instance;
  }
}
