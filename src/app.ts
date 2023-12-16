import express, { type Express } from 'express';
import type IRouter from '@/types/IRouter';
import cors from 'cors';
import env from '@/utils/enviroments';
import CONSTS from './utils/consts';
import StreamServer from './utils/stream_server/StreamServer';

export default class App {
  static instance: App | null = null;
  public app: Express;
  private constructor() {
    this.app = express();

    this.middlewares();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(
      `/${CONSTS.URL_MEDIA_NAME}`,
      express.static(CONSTS.FOLDER_MEDIA_NAME)
    );
  }

  import(route: IRouter): void {
    this.app.use(route.path, route.router);
  }

  initialize(): void {
    const PORT = env.EXPRESS_PORT;
    this.initializeNMS();
    this.app.listen(PORT, () => {
      console.log(`Server Lisent to Port ${PORT}`);
    });
  }

  private initializeNMS(): void {
    // Initialize Node Media Server
    StreamServer.getInstance().run();
  }

  static getInstance(): App {
    if (this.instance === null) {
      this.instance = new App();
    }

    return this.instance;
  }
}
