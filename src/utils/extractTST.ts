import type { $Enums } from '@prisma/client';

export interface ArgumentsSetExtractTypesSubtypes {
  type: $Enums.Type;
  filename: string;
}

export default class ExtractTypesSubtypes {
  private type: $Enums.Type;
  private subType: $Enums.SubType;
  private constructor() {
    this.type = 'IMAGE';
    this.subType = 'JPG';
  }

  Convert({ filename, type }: ArgumentsSetExtractTypesSubtypes): boolean {
    const extensionName = filename.split('.')[1];
    const data: ArgumentsSetExtractTypesSubtypes = {
      filename: extensionName,
      type
    };
    return this.setTypeString(data);
  }

  ConverGet(data: ArgumentsSetExtractTypesSubtypes):
    | {
        type: $Enums.Type;
        subType: $Enums.SubType;
      }
    | false {
    if (this.Convert(data)) {
      return {
        subType: this.getSubType(),
        type: this.getType()
      };
    } else {
      return false;
    }
  }

  getType(): $Enums.Type {
    return this.type;
  }

  getSubType(): $Enums.SubType {
    return this.subType;
  }

  private setType(type: $Enums.Type): void {
    this.type = type;
  }

  private setSubType(subType: $Enums.SubType): void {
    this.subType = subType;
  }

  private setTypeString({
    filename,
    type
  }: ArgumentsSetExtractTypesSubtypes): boolean {
    this.setType(type);
    switch (type) {
      case 'AUDIO':
        return this.setAudioSubtype(filename);
      case 'DOCUMENT':
        return this.setDocumentSubtype(filename);
      case 'IMAGE':
        return this.setImageSubtype(filename);
      case 'VIDEO':
        return this.setVideoSubtype(filename);
      default:
        console.log('No Corret type');
        return false;
    }
  }

  private setAudioSubtype(sbType: string): boolean {
    switch (sbType) {
      case 'wav':
        this.setSubType('WAV');
        return true;
      case 'mp3':
        this.setSubType('MP3');
        return true;
      default:
        console.log('No Corret Subtype Audio');
        return false;
    }
  }

  private setImageSubtype(sbType: string): boolean {
    switch (sbType) {
      case 'jpg':
        this.setSubType('JPG');
        return true;
      case 'jpeg':
        this.setSubType('JPEG');
        return true;
      case 'png':
        this.setSubType('PNG');
        return true;
      case 'ico':
        this.setSubType('ICO');
        return true;
      default:
        console.log('No Corret Subtype Image');
        return false;
    }
  }

  private setDocumentSubtype(sbType: string): boolean {
    switch (sbType) {
      case 'pdf':
        this.setSubType('PDF');
        return true;
      case 'docx':
        this.setSubType('WORD');
        return true;
      case 'xls':
        this.setSubType('EXCEL');
        return true;
      default:
        console.log('No Corret Subtype Document');
        return false;
    }
  }

  private setVideoSubtype(sbType: string): boolean {
    switch (sbType) {
      case 'mp4':
        this.setSubType('MP4');
        return true;
      case 'mkv':
        this.setSubType('MKV');
        return true;
      case 'mov':
        this.setSubType('MOV');
        return true;
      default:
        console.log('No Corret Subtype Video');
        return false;
    }
  }

  static instance: ExtractTypesSubtypes | null = null;
  static getInstance(): ExtractTypesSubtypes {
    if (this.instance === null) {
      this.instance = new ExtractTypesSubtypes();
    }

    return this.instance;
  }
}
