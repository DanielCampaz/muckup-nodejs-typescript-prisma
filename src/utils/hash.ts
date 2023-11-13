import md5 from 'md5';

export default class Hash {
  static instance: Hash | null = null;
  private constructor() {}

  hashText(txt: string): string {
    return md5(txt);
  }

  static getInstance(): Hash {
    if (this.instance === null) {
      this.instance = new Hash();
    }

    return this.instance;
  }
}
